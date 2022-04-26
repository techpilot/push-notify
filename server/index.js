const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

// ###You can generate VAPID keys using the command:
// **./node_modules/.bin/web-push generate-vapid-keys**

webpush.setVapidDetails(
  "mailto: `stephenngwu30@gmail.com`",
  "BEhgturqO11Ge40M6tPx0Ql8yYH7VGelqRdYzBc7sna41TM1s1jfayRmItV3_Ekl5lZBsTMNxxcGOq_tswBtb_4",
  "nKSi9ijp0Yl1JzuWSpv-f0o6nqUD9YAn-HZ5Wz9HEdE"
);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.post("/notifications/subscribe", (req, res) => {
  console.log(req.body);
  const payload = JSON.stringify({
    title: req.body.title,
    description: req.body.description,
    icon: req.body.icon,
  });
  // console.log(req.body.subscription);
  webpush
    .sendNotification(req.body.subscription, payload)
    .then((result) => console.log())
    .catch((e) => console.log(e.stack));

  res.status(200).json({ success: true });
});

app.listen(8000, () =>
  console.log("The server has been started on the port 8000")
);
