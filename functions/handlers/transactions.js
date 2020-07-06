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
        id: `${doc.id}`
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
    tid: req.body.tid,
    person: req.body.person,
  };
  const transDoc = db.collection("transactions").doc(newPeople.tid);

  transDoc
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      if (doc.data().admin !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        var peopleList = doc.data().people;
        peopleList.push(newPeople.person);
        return transDoc.update({
          people: peopleList,
        });
      }
    })
    .then(() => {
      return res.json({ message: `${newPeople.person} added successfully` });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.deletePeople = (req, res) => {
  const newPeople = {
    tid: req.params.tid,
    person: req.params.person,
  };
  const transDoc = db.collection("transactions").doc(newPeople.tid);

  transDoc
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      if (doc.data().admin !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        var peopleList = doc.data().people;
        peopleList = peopleList.filter(item => item !== newPeople.person);
        return transDoc.update({
          people: peopleList,
        });
      }
    })
    .then(() => {
      return res.json({ message: `${newPeople.person} removed successfully` });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};