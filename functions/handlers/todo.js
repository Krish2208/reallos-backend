const { db } = require("../utils/admin");

exports.addTodo = (req, res) => {
  const tid = req.params.tid;
  const newTodo = {
    title: req.body.title,
    description: req.body.description,
    date: req.body.date,
    assignedTo: req.body.assignedTo,
    assignedBy: req.body.assignedBy,
    completed: false,
  };
  const txnDoc = db.collection("transactions").doc(tid)
  txnDoc.get().then((doc)=>{
    if(!doc.exists){
      return res.json({error : "Transaction not found"})
    }
    else{
      return txnDoc.collection("tasks").add(newTodo)
    }
  })
  .then((doc)=> {
    return res.json({id: doc.id});
  })
  .catch((err) => {
    return res.status(500).json({ error: err.code });
  });
};

exports.deleteTodo = (req, res) => {
  const document = db.doc(`transactions/${req.params.tid}/tasks/${req.params.taskid}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Task not found" });
      }
      if (doc.data().assignedBy.id !== req.user.uid) {
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
  const tid = req.params.tid;
  const taskid = req.params.taskid;
  db.collection("transactions")
    .doc(tid)
    .collection("tasks")
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
  const document = db.doc(`transactions/${req.params.tid}/tasks/${req.params.taskid}`);
  let taskDetails = {};

  if (req.body.title.trim() !== "") taskDetails.title = req.body.title;
  if (req.body.description.trim() !== "")
    taskDetails.description = req.body.description;
  if (req.body.date.trim() !== "") taskDetails.date = req.body.date;
  taskDetails.assignedTo = req.body.assignedTo;
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Task not found" });
      }
      if (doc.data().assignedBy.id !== req.user.uid) {
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

exports.getAllTodo = (req,res) => {
  const tid = req.params.tid;
  const taskArr = [];

  db.collection("transactions").doc(tid).collection("tasks").get()
  .then((querySnapshot)=>{
    return querySnapshot.forEach((doc)=>{
      const obj = Object.assign({id: doc.id}, doc.data());
      taskArr.push(obj);
    })
  })
  .then(()=>{
    return res.json({todoList : taskArr});
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).json({ error: err.code });
  });
}

exports.markDone = (req,res) => {
  const user = req.user.uid;
  const document = db.doc(`transactions/${req.params.tid}/tasks/${req.params.taskid}`)
  document.get()
  .then((doc)=>{
    return document.update({completed: true})
  })
  .then(()=>{
    return res.json({message: "Successfully Mark as Done"})
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).json({ error: err.code });
  });
}