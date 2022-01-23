
const express = require("express");
const app = express();
const moment = require("moment");
const TaskModel = require("../models/Task");

//create task
app.post("/tasks", async (req, res) => {
    console.log(req.body);
    const task = new TaskModel({
      Title: req.body.Title,
      DateDebut: moment(req.body.DateDebut).format("yyyy-MM-DD"),
      DateFin: moment(req.body.DateFin).format("yyyy-MM-DD"),
      Description: req.body.Description,
      Priority: req.body.Priority,
      Statut: req.body.Statut,
    });
  
    try {
      await task.save();
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json(error);
    }
  });
  //getTask
  app.get("/task/:id", async (req, res) => {
    try {
      const tasks = await TaskModel.findById(req.params.id);
      res.status(201).send(tasks);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  //read Tasks
  app.get("/tasks", async (req, res) => {
   await TaskModel.find({}, (error, result) => {
      if (error) {
        res.status(400).json(error);
      }
      res.status(200).send(result);
    });
  });
  //delete task
  app.delete("/delete/task/:id", async (req, res) => {
    const id = req.params.id;
    await TaskModel.findByIdAndRemove(id).exec();
    res.send("deleted");
  });
  //edit task
  app.put("/update/task/:id", async (req, res) => {
    try {
      const updatedTask = await TaskModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  //ADD comment
  app.put("/add/comment/:id", async (req, res) => {
    try {
      const comments = {
        date: Date.now(),
        text: req.body.text,
        user_name: req.body.user_name,
        id: req.body.id,
      };
      let result = await TaskModel.findById(req.params.id);
      result.Comments.push(comments);
      await result.save();
      res.status(200).json(result);
    } catch (error) {
      console.log({error})
      res.status(400).json(error);
    }
  });
  module.exports=app;