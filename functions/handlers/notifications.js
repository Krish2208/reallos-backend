const functions = require("firebase-functions");
const { db } = require("../utils/admin");

exports.createTaskNotification = functions.firestore
  .document("transactions/{tid}/tasks/{taskid}")
  .onCreate((snapshot) => {
    db.collection("users")
      .where("transactions", "array-contains", snapshot.tid)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.forEach((doc) => {
          db.collection("users")
            .doc(doc.id)
            .collection("notifications")
            .doc(snapshot.taskid)
            .set({
              type: "TASK",
              docData: snapshot.data(),
            });
        });
      })
      .then(() => {
        return;
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  });
