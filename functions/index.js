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
  addPeople
} = require("./handlers/transactions");
const { addTodo, deleteTodo, readTodo } = require("./handlers/todo");

//Signup Route
app.post("/signup", signup);

// login route
app.post("/login", login);

// Get User Details
app.get('/user-details', Auth ,getUserDetails);

app.post("/create-transaction", Auth ,createTransaction);
app.delete('/delete-transaction/:tid', Auth ,deleteTransaction);
app.put("/update-transaction/:tid", Auth ,updateTransaction);
app.get('/get-transaction/:tid', readTransaction);
app.post("/add-people", Auth, addPeople)

app.post("/add-task", Auth, addTodo);
app.delete('/delete-task/:taskid', Auth, deleteTodo);
app.get('/get-task/:taskid', readTodo);

exports.api = functions.https.onRequest(app); // Exporting the app
