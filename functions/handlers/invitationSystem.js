const { db } = require("../utils/admin");

exports.invitationSystem = (req, res) => {
  const tid = req.params.tid;
  const uid = req.user.uid;

  const userDoc = db.collection("users").doc(uid);
  const transactionDoc = db
    .collection("transactions")
    .doc(tid)
    .collection("people");

  userDoc
    .get()
    .then((doc) => {
      var email = doc.data().email;
      return transactionDoc.doc(email).update({
        uid: uid,
        status: "Invitation Accepted",
      });
    })
    .then(() => {
      return res.json({
        message: "Person succeffully accepted the invitation",
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};
