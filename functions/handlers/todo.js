const { db } = require("../utils/admin");

exports.addTodo = (req, res) => {
  const newTodo = {
    tid: req.body.tid,
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    assignedTo: req.body.assignedTo,
    assignedBy: req.user.uid
  };

  db.collection("transactions")
    .doc(newTodo.tid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        db.collection("tasks")
          .add(newTodo)
          .then((doc) => {
            console.log("New Task added successfully");
            return res.json({
              message: `Task ${doc.id} in ${newTodo.tid} added successfully`,
            });
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ error: err.code });
          });
          return res.json({message: "Added Successfully!!"})
      }
      else return res.status(400).json({error : "Transaction does not exists"})
    })
    .catch((err) => {
        console.log(err);
        return res.status(500).json({ error: err.code });
    });
};
exports.deleteTodo = (req, res) => {
  const document = db.doc(`/tasks/${req.params.taskid}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Task not found" });
      }
      if (doc.data().assignedBy !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      return res.json({ message: "Task Successfully deleted" });
    })
    .catch((err) => {
      return res.status(500).json({ error: err.code });
    });
};

exports.readTodo = (req, res) => {
  const taskid = req.params.taskid;

  db.collection("tasks")
    .doc(taskid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log(`Task ${taskid} Data : `, doc.data());
        return res.json(doc.data());
      } else {
        console.log("Task does not exists");
        return res.json({ error: "Task does not exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.editTodo = (req,res) => {
  const document = db.doc(`/tasks/${req.params.taskid}`);
  let taskDetails = {};

  if (req.body.title.trim() !== "") taskDetails.title = req.body.title;
  if (req.body.description.trim() !== "")
    taskDetails.description = req.body.description;
  if (req.body.date.trim() !== "") taskDetails.date = req.body.date;
  if (req.body.assignedTo.trim() !== "") taskDetails.assignedTo = req.body.assignedTo;
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Task not found" });
      }
      if (doc.data().assignedBy !== req.user.uid) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.update(taskDetails);
      }
    })
    .then(() => {
      console.log("Task successfully updated!");
      return res.json({
        message: `Task ${req.params.taskid} successfully updated!`,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err.code });
    });
};