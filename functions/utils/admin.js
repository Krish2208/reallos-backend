const admin = require('firebase-admin');
admin.initializeApp();

const db = admin.firestore(); // Getting the database

module.exports = {admin, db}