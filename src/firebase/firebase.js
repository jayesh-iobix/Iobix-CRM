// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3oEBFbEcJuSsydnGHyHlSKJXPtF3fA9c",
  authDomain: "iobix-internal-crm.firebaseapp.com",
  projectId: "iobix-internal-crm",
  storageBucket: "iobix-internal-crm.firebasestorage.app",
  messagingSenderId: "175041541347",
  appId: "1:175041541347:web:546893553ead5443c441d6",
  measurementId: "G-LH2FTHDDR1"
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
      "BMJdBmT_HG1NcRtaygZg71bqZoRQCsLhkjXGks726bNTGkVsYAEwBCAiM7CVtFZZjGAtLMGiBw1pzhbG-B01TdE" // Replace with your actual VAPID key
      // "BDwin9GPI89uYBOZ_kketB7Bko6cWpgVIiRed1FpdIbxMBihUYnpmDzupodPT5O2ESxHA4F9NVJm3jDvrzAYpC8" // Replace with your actual VAPID key
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