// firebase.js - 100% WORKING LIVE PROJECT
const firebaseConfig = {
  apiKey: "AIzaSyAKrC7NkRDn68SP-xRhWA6unp_5dxmaaZg",
  authDomain: "placementsystem-3806e.firebaseapp.com",
  projectId: "placementsystem-3806e",
  storageBucket: "placementsystem-3806e.firebasestorage.app",
  messagingSenderId: "109402463804",
  appId: "1:109402463804:web:aca9043d608ee5e696ad39"
};

firebase.initializeApp(firebaseConfig);
window.auth = firebase.auth();
window.db = firebase.firestore();
window.firebaseUser = null;
window.currentRole = 'student';

window.auth.onAuthStateChanged((user) => {
  window.firebaseUser = user;
  console.log('✅ Firebase User:', user ? user.email : 'Logged out');
});