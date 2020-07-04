const functions = require("firebase-functions");
const cors = require("cors");

const app = require("express")();
app.use(cors()); // using cors to for creating restful api

const Auth = require('./utils/Auth');

const { signup, login, getUserDetails } = require("./handlers/users");
const {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  readTransaction,
} = require("./handlers/transactions");
const { addTodo } = require("./handlers/todo");

//Signup Route
app.post("/signup", signup);

// login route
app.post("/login", login);

// Get User Details
app.post("/user-details", Auth ,getUserDetails);

app.post("/create-transaction", createTransaction);
app.post("/delete-transaction", deleteTransaction);
app.post("/update-transaction", updateTransaction);
app.post("/get-transaction", readTransaction);
//app.post("/add-people", addPeople)

app.post("/add-task",addTodo);

exports.api = functions.https.onRequest(app); // Exporting the app
