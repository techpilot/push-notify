const express = require("express");
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
  "mailto: `your email address`",
  "PUBLIC_VAPID_KEY",
  "PRIVATE_VAPID_KEY"
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

    userEndpoints.map(({ subscription }) => {
      webpush
        .sendNotification(subscription, pushPayload)
        .catch((err) => console.log(err));
    });
  }

  res.send("Notification sent!");
});

app.post("/notifications/subscribe", async (req, res) => {
  const subscription = req.body.subscription;

  const getSubscriptions = await getEndpoints(
    subscription.endpoint,
    req.body.userId
  );

  const endpoints = getSubscriptions.data;
  console.log("endpoints", endpoints);

  if (endpoints.length === 0) {
    // if user has no endpoints that matches the endpoint of the current subscription
    const newEndpoint = new EndpointModel({
      endpoint: subscription.endpoint,
      subscription,
      userId: req.body.userId,
      createdAt: Date.now(),
    });

    try {
      await newEndpoint.save();
      // res.status(201).json(newEndpoint);
      console.log("Endpoint created");
    } catch (error) {
      // res.status(409).json({ message: error.message });
      console.log(error);
    }
  }
  res.send("Subscription added!");
});

app.listen(8000, () =>
  console.log("The server has been started on the port 8000")
);
