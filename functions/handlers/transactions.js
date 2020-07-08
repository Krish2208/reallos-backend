const { db } = require("../utils/admin");
const firebase = require("../utils/firebaseConfig");

exports.createTransaction = (req, res) => {
  const newTransaction = {
    name: req.body.name,
    address: req.body.address,
    desc: req.body.desc,
    people: req.body.people,
    admin: req.user.uid,
    createdAt: new Date().toISOString(),
  };
  db.collection("transactions")
    .add(newTransaction)
    .then((doc) => {
      console.log(doc.id);
      return res.json({
        id: `${doc.id}`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};
exports.deleteTransaction = (req, res) => {
  const document = db.doc(`/transactions/${req.params.tid}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      if (doc.data().admin !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: "Transaction Successfully deleted" });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

exports.updateTransaction = (req, res) => {
  const document = db.doc(`/transactions/${req.params.tid}`);
  let transactionDetails = {};

  if (req.body.name.trim() !== "") transactionDetails.name = req.body.name;
  if (req.body.address.trim() !== "")
    transactionDetails.address = req.body.address;
  if (req.body.desc.trim() !== "") transactionDetails.desc = req.body.desc;
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      if (doc.data().admin !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.update(transactionDetails);
      }
    })
    .then(() => {
      console.log("Transaction successfully updated!");
      return res.json({
        message: `Transaction ${req.params.tid} successfully updated!`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.readTransaction = (req, res) => {
  const tid = req.params.tid;

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

exports.addPeople = (req, res) => {
  const newPeople = {
    tid: req.params.tid,
    email: req.body.email,
    status: "Invitation Pending",
    uid: "",
    role: req.body.role,
    name: req.body.name,
  };
  const txnDoc = db.collection("transactions").doc(newPeople.tid);
  txnDoc
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.json({ error: "Transaction not found" });
      } else {
        return txnDoc.collection("people").doc(newPeople.email).set(newPeople);
      }
    })
    .then((doc) => {
      return res.json({ id: newPeople.email });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

exports.deletePeople = (req, res) => {
  const person = {
    tid: req.params.tid,
    email: req.params.email,
  };
  db.collection("transactions")
    .doc(person.tid)
    .collection("people")
    .doc(person.email)
    .delete()
    .then(() => {
      return res.json({ message: "Successfully Removed" });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.addTransactionToUser = (req, res) => {
  const tid = req.params.tid;
  userDoc = db.doc(`users/${req.user.uid}`);

  userDoc
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "User not found" });
      } else {
        var txnList = doc.data().transactions;
        txnList.push(tid);
        return userDoc.update({
          transactions: txnList,
        });
      }
    })
    .then(() => {
      return res.json({
        message: `${tid} added successfully to ${req.user.uid}`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.addMultiplePeople = (req,res) =>{
  const tid = req.params.tid;
  const people = req.body.people;
  const txnDoc = db.collection("transactions").doc(tid);
  txnDoc
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.json({ error: "Transaction not found" });
      } else {
        people.forEach(person => {
          txnDoc.collection("people").doc(person.email).set(person);
        });
        return res.json({ message: "All added successfully" }); 
      }
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

exports.getAllTransaction = (req,res) => {
  const uid = req.params.uid;

  db.collection("users").doc(uid).get()
  .then((doc)=>{
    return res.json({txnList: doc.data().transactions})
  })
  .catch((err) => {
    return res.status(500).json({ error: err.code });
  });
}