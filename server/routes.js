const express = require("express");
const { ObjectId } = require("mongodb");
const { getCollection } = require("./models/index");

const router = express.Router();

// GET /todos
router.get("/todos", async (req, res) => {
  try {
    const collection = getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});


// POST /todos
router.post("/todos", async (req, res) => {
  try {
    const collection = getCollection();
    const { todo } = req.body;

    const newTodo = {
      todo,
      status: false
    };

    const result = await collection.insertOne(newTodo);

    res.status(201).json({
      _id: result.insertedId,
      ...newTodo
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});


// DELETE /todos/:id
router.delete("/todos/:id", async (req, res) => {
  try {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);

    const result = await collection.deleteOne({ _id });

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
});


// UPDATE /todos/:id
router.put("/todos/:id", async (req, res) => {
  try {
    const collection = getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    const result = await collection.updateOne(
      { _id },
      { $set: { status: !status } }
    );

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
});

module.exports = router;