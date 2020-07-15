const functions = require("firebase-functions");
const cors = require("cors");

const app = require("express")();
app.use(cors()); // using cors to for creating restful api

const Auth = require('./utils/Auth');

const { signup, login, getUserDetails, resetPassword, updateProfile, addUserDetails } = require("./handlers/users");
const {
  createTransaction,
  deleteTransaction,
  updateTransaction,
  readTransaction,
  addPeople,
  deletePeople,
  addTransactionToUser,
  addMultiplePeople,
  getAllTransaction,
  getAllPeople,
  removeTransactionFromAllUser,
} = require("./handlers/transactions");
const { addTodo, deleteTodo, readTodo, editTodo, getAllTodo, markDone } = require("./handlers/todo");
const { invitationSystem } = require("./handlers/invitationSystem");

//Signup Route
app.post("/signup", signup);

// Add User Details
app.post("/add-user-details/:uid", addUserDetails);

// login route
app.post("/login", login);

// Get User Details
app.get('/user-details', Auth ,getUserDetails);

// Password Reset
app.post('/reset-password/:email', resetPassword);

// Update Profile
app.put('/update-profile', Auth, updateProfile);


// Transaction Related
app.post("/create-transaction", Auth ,createTransaction);
app.delete('/delete-transaction/:tid', Auth ,deleteTransaction);
app.put("/update-transaction/:tid", Auth ,updateTransaction);
app.get('/get-transaction/:tid', readTransaction);
app.post("/add-people/:tid", Auth, addPeople);
app.delete("/delete-people/:tid/:email", Auth, deletePeople);
app.put("/add-transaction-to-user/:tid", Auth, addTransactionToUser);
app.post("/add-multiple-people/:tid", Auth, addMultiplePeople);
app.get("/get-all-transactions/:uid", Auth, getAllTransaction);
app.get("/get-all-people/:tid", Auth, getAllPeople);
app.put("/remove-transaction-from-users/:tid", Auth, removeTransactionFromAllUser);

//Task Related
app.post("/add-task/:tid", Auth, addTodo);
app.delete('/delete-task/:tid/:taskid', Auth, deleteTodo);
app.get('/get-task/:tid/:taskid', readTodo);
app.put('/update-task/:tid/:taskid', Auth, editTodo);
app.get('/get-all-tasks/:tid', Auth, getAllTodo);
app.put('/task-done/:tid/:taskid', Auth, markDone);

// Invitation System Related
app.post("/invite/:tid", Auth, invitationSystem);


exports.api = functions.https.onRequest(app); // Exporting the app
