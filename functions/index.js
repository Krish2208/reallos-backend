const functions = require('firebase-functions');
const cors = require('cors');

const app = require('express')();
app.use(cors()); // using cors to for creating restful api 


const {signup,login} = require('./handlers/users');



//Signup Route
app.post('/signup', signup);

// login route
app.post('/login',login);


exports.api = functions.https.onRequest(app); // Exporting the app