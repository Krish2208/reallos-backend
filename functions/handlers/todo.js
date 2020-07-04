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
