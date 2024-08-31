const express = require("express");
const router = express.Router();
const { getConnectedClient } = require("./database");
const { ObjectId } = require("mongodb");

const getCollection = () => {
  const client = getConnectedClient();
  const collection = client.db("todosdb").collection("todos");
  return collection;
};

// GET /todos
router.get("/todos", async (req, res) => {
  const collection = getCollection();
  const todos = await collection.find({}).toArray();

  res.status(200).json(todos);
});

// POST /todos
router.post("/todos", async (req, res) => {
  const collection = getCollection();
  let { todo } = req.body;

  if (!todo) {
    return res.status(400).json({ mssg: "error no todo found" });
  }

  todo = typeof todo === "string" ? todo : JSON.stringify(todo);

  const newTodo = await collection.insertOne({ todo, status: false });

  res.status(201).json({ todo, status: false, _id: newTodo.insertedId });
});

// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);

  const deletedTodo = await collection.deleteOne({ _id });

  res.status(200).json(deletedTodo);
});

// PUT /todos/:id - update both status and content
router.put("/todos/:id", async (req, res) => {
  const collection = getCollection();
  const _id = new ObjectId(req.params.id);
  const { status, todo } = req.body;

  // Validate input
  if (status !== undefined && typeof status !== "boolean") {
    return res.status(400).json({ mssg: "invalid status" });
  }

  if (todo !== undefined && typeof todo !== "string") {
    return res.status(400).json({ mssg: "invalid todo content" });
  }

  const updateFields = {};
  if (status !== undefined) {
    updateFields.status = status;
  }
  if (todo !== undefined) {
    updateFields.todo = todo;
  }

  const updatedTodo = await collection.updateOne(
    { _id },
    { $set: updateFields }
  );

  res.status(200).json(updatedTodo);
});

module.exports = router;
