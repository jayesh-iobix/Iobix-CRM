// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBqw3shvbnD3PWBJFZLXMYLLA5rBk25yE",
  authDomain: "iobix-crm.firebaseapp.com",
  projectId: "iobix-crm",
  storageBucket: "iobix-crm.firebasestorage.app",
  messagingSenderId: "487169874511",
  appId: "1:487169874511:web:de18fe599bee6ae24c683a",
  measurementId: "G-2Z18Z903ZD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Messaging and export it for usage in other files
const messaging = getMessaging(app);

export const generateToken = async () => {
  const permission = await Notification.requestPermission();
  // console.log(permission)
  if (permission === "granted") {
    // debugger;
    const deviceToken = await getToken(messaging, {
      vapidKey: 
      "BDwin9GPI89uYBOZ_kketB7Bko6cWpgVIiRed1FpdIbxMBihUYnpmDzupodPT5O2ESxHA4F9NVJm3jDvrzAYpC8" // Replace with your actual VAPID key
    });
    sessionStorage.setItem("deviceToken", deviceToken);
    // console.log("FCM Device Token: ", deviceToken);
    // return token;
  } else {
    console.error("Notification permission denied.");
  }
}; 

// Listen for foreground messages (optional)
onMessage(messaging, (payload) => {
  console.log('Message received in foreground: ', payload);
});

export { messaging };