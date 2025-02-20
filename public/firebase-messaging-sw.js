// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
// Replace 10.13.2 with latest version of the Firebase JS SDK.
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyBBqw3shvbnD3PWBJFZLXMYLLA5rBk25yE",
    authDomain: "iobix-crm.firebaseapp.com",
    projectId: "iobix-crm",
    storageBucket: "iobix-crm.firebasestorage.app",
    messagingSenderId: "487169874511",
    appId: "1:487169874511:web:de18fe599bee6ae24c683a",
    measurementId: "G-2Z18Z903ZD"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = 'payload.notification.title';
    const notificationOptions = {
      body: 'payload.notification.body',
      icon: 'payload.notification.image',
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });















// // Give the service worker access to Firebase Messaging.
// // Note that you can only use Firebase Messaging here. Other Firebase libraries
// // are not available in the service worker.
// // Replace 10.13.2 with latest version of the Firebase JS SDK.
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// // Initialize the Firebase app in the service worker by passing in
// // your app's Firebase config object.
// // https://firebase.google.com/docs/web/setup#config-object
// firebase.initializeApp({
//   apiKey: "AIzaSyDx7Vi7p3HsKY4_8MLQAKDqh9mxocp_6ok",
//   authDomain: "eventapp-799a4.firebaseapp.com",
//   projectId: "eventapp-799a4",
//   storageBucket: "eventapp-799a4.firebasestorage.app",
//   messagingSenderId: "707933055140",
//   appId: "1:707933055140:web:d57acb82eed54e79bd9e31",
//   measurementId: "G-7QZQZJD1Q8"  
// });

// // Retrieve an instance of Firebase Messaging so that it can handle background
// // messages.
// const messaging = firebase.messaging();

// messaging.onBackgroundMessage((payload) => {
//     // console.log(
//     //   '[firebase-messaging-sw.js] Received background message ',
//     //   payload
//     // );
//     // Customize notification here
//     const notificationTitle = 'payload.notification.title';
//     const notificationOptions = {
//       body: 'payload.notification.body',
//       icon: 'payload.notification.image',
//     };
  
//     self.registration.showNotification(notificationTitle, notificationOptions);
//   });