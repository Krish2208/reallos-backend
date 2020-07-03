const functions = require("firebase-functions");
const cors = require("cors");

const app = require("express")();
app.use(cors()); // using cors to for creating restful api

const { signup, login } = require("./handlers/users");
const {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  readTransaction,
} = require("./handlers/transactions");

//Signup Route
app.post("/signup", signup);

// login route
app.post("/login", login);

app.post("/create-transaction", createTransaction);
app.post("/delete-transaction", deleteTransaction);
app.post("/update-transaction", updateTransaction);
app.post("/get-transaction", readTransaction)
//app.post("/add-people", addPeople)

exports.api = functions.https.onRequest(app); // Exporting the app
