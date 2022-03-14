const express = require("express");
const db = require("../database.js");
const mongodb = require("mongodb");

const router = express.Router();

router.get("/", async (req, res) => {
  const collection = await db.getTodoCollection();
  const todos = await collection.find().toArray();
  res.render("todos/todos-list", { todos });
});

router.get("/complete", async (req, res) => {
  const collection = await db.getTodoCollection();
  const completeList = await collection.find({ done: true }).toArray();
  res.render("todos/todos-complete", { completeList });
});

router.get("/incomplete", async (req, res) => {
  const collection = await db.getTodoCollection();
  const incompletedList = await collection.find({ done: false }).toArray();
  res.render("todos/todos-incomplete", { incompletedList });
});

router.get("/ascending", async (req, res) => {
  const collection = await db.getTodoCollection();
  const todos = await collection.find().sort({ created: 1 }).toArray();
  res.render("todos/todos-list", { todos });
});

router.get("/descending", async (req, res) => {
  const collection = await db.getTodoCollection();
  const todos = await collection.find().sort({ created: -1 }).toArray();
  res.render("todos/todos-list", { todos });
});
router.get("/new", (req, res) => {
  res.render("todos/todos-create");
});

router.post("/new", async (req, res) => {
  var date = new Date();
  const todo = {
    description: req.body.description,
    done: false,
    created: date.toLocaleString(),
  };

  const todoCollection = await db.getTodoCollection();
  const result = await todoCollection.insertOne(todo);

  res.redirect("/todos");
});

router.get("/:id", async (req, res) => {
  const id = mongodb.ObjectId(req.params.id);
  const collection = await db.getTodoCollection();
  collection.findOne({ _id: id }, (err, todo) => {
    res.render("todos/todos-single", todo);
  });
});

router.post("/:id/ta-bort", async (req, res) => {
  const id = mongodb.ObjectId(req.params.id);
  const collection = await db.getTodoCollection();
  collection.deleteOne({ _id: id });
  res.redirect("/todos");
});

router.get("/:id/edit", async (req, res) => {
  const id = mongodb.ObjectId(req.params.id);
  const collection = await db.getTodoCollection();
  collection.findOne({ _id: id }, (err, todo) => {
    res.render("todos/todos-edit", todo);
  });
});

router.post("/:id/edit", async (req, res) => {
  const id = mongodb.ObjectId(req.params.id);
  const collection = await db.getTodoCollection();

  const todo = {
    description: req.body.description,
    done: Boolean(req.body.done),
  };

  await collection.updateOne({ _id: id }, { $set: todo });
  res.redirect("/todos");
});

module.exports = router;
