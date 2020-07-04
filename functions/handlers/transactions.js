const { db } = require("../utils/admin");
const firebase = require('../utils/firebaseConfig');

exports.createTransaction = (req, res) => {
  const newTransaction = {
    name: req.body.name,
    address: req.body.address,
    desc: req.body.desc,
    people: req.body.people,
    createdAt: new Date().toISOString(),
  };
  db.collection("transactions")
    .add(newTransaction)
    .then((doc) => {
      console.log(doc.id);
      return res.json({
        message: `Transaction ${doc.id} successfully created`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};
exports.deleteTransaction = (req, res) => {
  const tid = req.body.tid;

  db.collection("transactions")
    .doc(tid)
    .delete()
    .then(() => {
      console.log("Transaction successfully deleted!");
      return res.json({ message: "Transaction Successfully deleted" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.updateTransaction = (req, res) => {
  let transactionDetails = {};

  if (req.body.name.trim() !== "") transactionDetails.name = req.body.name;
  if (req.body.address.trim() !== "")
    transactionDetails.address = req.body.address;
  if (req.body.desc.trim() !== "") transactionDetails.desc = req.body.desc;

  db.collection("transactions")
    .doc(req.body.tid)
    .update(transactionDetails)
    .then(() => {
      console.log("Transaction successfully updated!");
      return res.json({
        message: `Transaction ${req.body.tid} successfully updated!`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.readTransaction = (req, res) => {
  const tid = req.body.tid;

  db.collection("transactions")
    .doc(tid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(`Transaction ${tid} Data : `, doc.data());
        return res.json(doc.data());
      } else {
        console.log("Transaction does not exists");
        return res.json({ error: "Transaction does not exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

/*exports.addPeople = (req, res) => {
  const newPeople = {
    tid: req.body.tid,
    person: req.body.person,
  };

  db.collection("transactions")
    .doc(newPeople.tid)
    .update({
      people: firebase.firestore.FieldValue.arrayUnion(),
    })
    .then(() => {
      return res.json({ message: `${newPeople.person[0]} added successfully` });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};*/
