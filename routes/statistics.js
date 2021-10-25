
const router = require("express").Router();
const UserModel = require("../models/User");
const Task = require('../models/Task')
router.get("/userStat", async (req, res) => {
    UserModel.find((error, result) => {
      if (error) {
        res.status(400).json(error);
      }
      res.status(200).json(result.length);
    });
  });

  router.get("/tasksStat", async (req, res) => {
    Task.find((error, result) => {
      if (error) {
        res.status(400).json(error);
      }
      const todo = result.filter((ticket) => ticket.Statut === "todo");
      const inProgress = result.filter((ticket) => ticket.Statut === "inprogress");
      const done = result.filter((ticket) => ticket.Statut === "done");
     
      console.log(todo);
      console.log(done);
      console.log(inProgress);

      res.status(200).json({todo : todo.length , inProgress : inProgress.length ,done : done.length});
    });
  });

  

  module.exports= router;