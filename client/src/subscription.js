// NOTE: Please don't use this key. Create a new one and use it.
const convertedVapidKey = urlBase64ToUint8Array(
  "BEhgturqO11Ge40M6tPx0Ql8yYH7VGelqRdYzBc7sna41TM1s1jfayRmItV3_Ekl5lZBsTMNxxcGOq_tswBtb_4"
);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscription(subscription) {
  return fetch(`/notifications/subscribe`, {
    method: "POST",
    body: JSON.stringify({
      subscription: subscription,
      userId: "11155",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function sendNotification(value) {
  console.log(value);
  return fetch(`/notifications/notify`, {
    method: "POST",
    body: JSON.stringify({
      title: "Notified by keccak.eth",
      description: "meet the real experts",
      icon: "https://ichef.bbci.co.uk/news/976/cpsprodpb/9A50/production/_118740593_gettyimages-1231144196.jpg",
      userId: "11155",
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

//conditional render
let clicked = true;

export function subscribeUser() {
  if (clicked) {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(function (registration) {
          if (!registration.pushManager) {
            console.log("Push manager unavailable.");
            return;
          }

          registration.pushManager
            .getSubscription()
            .then(function (existedSubscription) {
              if (existedSubscription === null) {
                console.log("No subscription detected, make a request.");
                registration.pushManager
                  .subscribe({
                    applicationServerKey: convertedVapidKey,
                    userVisibleOnly: true,
                  })
                  .then(function (newSubscription) {
                    console.log("New subscription added.", newSubscription);
                    sendSubscription(newSubscription);
                  })
                  .catch(function (e) {
                    if (Notification.permission !== "granted") {
                      console.log("Permission was not granted.");
                    } else {
                      console.error(
                        "An error ocurred during the subscription process.",
                        e
                      );
                    }
                  });
              } else {
                console.log(
                  "Existed subscription detected.",
                  existedSubscription
                );
                sendSubscription(existedSubscription);
              }
            });
        })
        .catch(function (e) {
          console.error(
            "An error ocurred during Service Worker registration.",
            e
          );
        });
    }
  } else {
    console.log("Can not reachable to the service worker");
  }
}
