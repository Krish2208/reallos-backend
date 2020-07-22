const { db, admin } = require("../utils/admin");
const sgMail = require("@sendgrid/mail");
const functions = require("firebase-functions");
const API_KEY = functions.config().sendgrid.key;
const TEMPLATE_ID = functions.config().sendgrid.template;
sgMail.setApiKey(API_KEY);

exports.invitationSystem = (req, res) => {
  const tid = req.params.tid;
  const uid = req.user.uid;

  const userDoc = db.collection("users").doc(uid);
  const transactionDoc = db
    .collection("transactions")
    .doc(tid)
    .collection("people");

  admin.auth().getUser(uid)
    .then((doc) => {
      var email = doc.email;
      return transactionDoc.doc(email).update({
        uid: uid,
        accepted: true,
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

exports.invitationMail = (user, email, tid, transactionName, address, role) => {
  const msg = {
    to: email,
    from: 'reallostest@gmail.com',
    templateId: TEMPLATE_ID,
    dynamic_template_data: {
      subject: `You are invited to Transaction ${transactionName} on Reallos`,
      tid: tid,
      url: email,
      user: user,
      transactionName: transactionName,
      address: address,
      role: role
    },
  };

  return sgMail.send(msg);
}