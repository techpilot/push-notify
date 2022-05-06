console.log("Service Worker Loaded...");
const id = "11155"; // check if the target userId is the currently logged in user

self.addEventListener("push", (event) => {
  const data = event.data.json();
  // handle the push notification
  console.log("New notification", data.userId);
  if (data.userId === id) {
    event.waitUntil(
      self.registration.showNotification(data.title, {
        body: data.description,
        icon: data.icon,
        requireInteraction: true,
        vibrate: 400,
        actions: [
          {
            action: "view",
            title: "View",
          },
        ],
      })
    );
  }
});

self.addEventListener(
  "notificationclick",
  function (event) {
    event.notification.close();
    if (event.action === "view") {
      // User selected the view action.
      clients.openWindow("https://whatido.app");
    } else {
      // User selected (e.g., clicked in) the main body of notification.
      clients.openWindow("/");
    }
  },
  false
);

// self.addEventListener(
//   "notificationclick",
//   function (event) {
//     if (!event.action) {
//       // Was a normal notification click
//       clients.openWindow("/");
//       return;
//     }

//     switch (event.action) {
//       case "view-message":
//         clients.openWindow("/messages/ongoing");
//         break;
//       case "view-comment":
//         clients.openWindow("/profile");
//         break;
//       default:
//         clients.openWindow("/");
//         break;
//     }
//   },
//   false
// );
