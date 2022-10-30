const express = require("express");
const cron = require("node-cron");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("web-push");
const mongoose = require("mongoose");
const EndpointModel = require("./endpointModel");
const getEndpoints = require("./checkSubscriber");
const getUserEndpoints = require("./userEndpoints");

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

// ###You can generate VAPID keys using the command:
// **./node_modules/.bin/web-push generate-vapid-keys**

mongoose
  .connect("mongodb://localhost:27017/push-notify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log(`DB connected`))
  .catch((error) => console.log(error.message));

// NOTE: Please don't use this keys. Create new ones and use them.
// npm install -g web-push(global) or npm install web-push(local)
// web-push generate-vapid-keys(global) or ./node_modules/.bin/web-push generate-vapid-keys(local)
webpush.setVapidDetails(
  "mailto: `stephenngwu30@gmail.com`",
  "BEhgturqO11Ge40M6tPx0Ql8yYH7VGelqRdYzBc7sna41TM1s1jfayRmItV3_Ekl5lZBsTMNxxcGOq_tswBtb_4",
  "nKSi9ijp0Yl1JzuWSpv-f0o6nqUD9YAn-HZ5Wz9HEdE"
);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/notifications/notify", async (req, res) => {
  const payload = req.body;

  const pushPayload = JSON.stringify({
    title: payload.title,
    description: payload.description,
    icon: payload.icon,
    userId: payload.userId,
    userToken: "",
  });

  if (payload.userId !== "" || payload.userId !== undefined) {
    const getAllEndpoints = await getUserEndpoints(payload.userId);
    const userEndpoints = getAllEndpoints.data;
    console.log(userEndpoints);

    userEndpoints.map(({ subscription }) => {
      webpush
        .sendNotification(subscription, pushPayload)
        .catch((err) => console.log(err));
    });
    console.log("Notification sent");
  }

  res.send("Notification sent!");
});

app.post("/notifications/subscribe", async (req, res) => {
  const subscription = req.body.subscription;

  const { data } = await getEndpoints(subscription.endpoint);

  if (req.body.userSlug) {
    if (data.length > 0) {
      data.map(async ({ userSlug, _id }) => {
        try {
          if (userSlug === req.body.userSlug) {
            console.log("USER ALREADY SUBSCRIBED");
          } else {
            await EndpointModel.updateOne(
              { _id: _id },
              { $set: { userSlug: req.body.userSlug } }
            );
            console.log("USER UPDATED");
          }
        } catch (error) {
          console.log("error", error);
        }
      });
    } else {
      // if no endpoints found
      const newEndpoint = new EndpointModel({
        endpoint: subscription.endpoint,
        subscription,
        userSlug: req.body.userSlug,
      });

      try {
        await newEndpoint.save();
        console.log("newEndpoint", newEndpoint);
        res.status(201).json(newEndpoint);
      } catch (error) {
        res.status(409).json({ message: error.message });
      }
    }
  } else {
    data.map(async ({ _id }) => {
      try {
        await EndpointModel.findByIdAndDelete({ _id: _id });
      } catch (error) {
        console.log("error", error);
      }
    });
  }
});

// cron job that deletes subscriptions that are upto 48 hours
cron.schedule("0 0 * * *", async () => {
  try {
    const deleteSubscription = await EndpointModel.deleteMany({
      createdAt: { $lte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    console.log("deleteSubscription", deleteSubscription);
  } catch (error) {
    console.log(error);
  }
});

app.listen(8000, () =>
  console.log("The server has been started on the port 8000")
);
