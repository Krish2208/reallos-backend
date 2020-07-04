const firebase = require('firebase');

firebase.initializeApp({
  apiKey: "AIzaSyCoMC83X66Ax_eDjQcTKtYd9eTbkiDzp58",
  authDomain: "reallos-test.firebaseapp.com",
  databaseURL: "https://reallos-test.firebaseio.com",
  projectId: "reallos-test",
  storageBucket: "reallos-test.appspot.com",
  messagingSenderId: "361319907913",
  appId: "1:361319907913:web:51c50386396e2f8b6bf598"
});

module.exports = firebase;