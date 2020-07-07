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
  addPeople,
  deletePeople,
  addTransactionToUser
} = require("./handlers/transactions");
const { addTodo, deleteTodo, readTodo, editTodo } = require("./handlers/todo");
const { invitationSystem } = require("./handlers/invitationSystem");

//Signup Route
app.post("/signup", signup);

// login route
app.post("/login", login);

// Get User Details
app.get('/user-details', Auth ,getUserDetails);

// Transaction Related
app.post("/create-transaction", Auth ,createTransaction);
app.delete('/delete-transaction/:tid', Auth ,deleteTransaction);
app.put("/update-transaction/:tid", Auth ,updateTransaction);
app.get('/get-transaction/:tid', readTransaction);
app.post("/add-people/:tid", Auth, addPeople);
app.delete("/delete-people/:tid/:email", Auth, deletePeople);
app.put("/add-transaction-to-user/:tid", Auth, addTransactionToUser);

//Task Related
app.post("/add-task/:tid", Auth, addTodo);
app.delete('/delete-task/:tid/:taskid', Auth, deleteTodo);
app.get('/get-task/:tid/:taskid', readTodo);
app.put('/update-task/:tid/:taskid', Auth, editTodo);

// Invitation System Related
app.post("/invite/:tid", Auth, invitationSystem);

exports.api = functions.https.onRequest(app); // Exporting the app
