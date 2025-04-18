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
    apiKey: "AIzaSyC3oEBFbEcJuSsydnGHyHlSKJXPtF3fA9c",
    authDomain: "iobix-internal-crm.firebaseapp.com",
    projectId: "iobix-internal-crm",
    storageBucket: "iobix-internal-crm.firebasestorage.app",
    messagingSenderId: "175041541347",
    appId: "1:175041541347:web:546893553ead5443c441d6",
    measurementId: "G-LH2FTHDDR1"
});


// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Listen for background messages and display notifications.
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    
    // Customize notification here.
    const notificationTitle = payload.notification.title;  // Corrected reference
    const notificationOptions = {
        body: payload.notification.body,  // Corrected reference
        icon: payload.notification.icon,  // Corrected reference (if you have an icon)
    };
  
    // Show the notification
    self.registration.showNotification(notificationTitle, notificationOptions);
});