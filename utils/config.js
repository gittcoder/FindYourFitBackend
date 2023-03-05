const firebase = require("firebase");
const { getStorage, ref } = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyDY8OellG0zqaYk5tTUQsmbK5vtsEOaxx0",
    authDomain: "findyourfit-63819.firebaseapp.com",
    projectId: "findyourfit-63819",
    storageBucket: "findyourfit-63819.appspot.com",
    messagingSenderId: "95617394772",
    appId: "1:95617394772:web:ca6a5999b656ca3a22e5c1",
    measurementId: "G-YB3KK4CQ3F"
  };
  
firebase.initializeApp(firebaseConfig);
// const db = firebase.firestore();

// const storage = firebase.storage();

// var storageRef = firebase.storage().ref();
// var fileRef = storageRef.child("images/d1.jpg");

module.exports = firebase;