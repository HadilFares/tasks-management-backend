const express = require("express");
const app = express();
const UserModel = require("../models/User");

// create 

app.post("/create", async (req, res) => {
    let { matricule, email, name, lastname, dateDemarrage } = req.body;
    const newUser = new UserModel({
      matricule: matricule,
      isAdmin: false,
      email: email,
      name: name,
      lastname: lastname,
      dateDemarrage: dateDemarrage,
    });
    try {
      await newUser.save();
      res.status(200).json({ id: newUser._id });
    } catch (error) {
      console.error(error);
    }
  });

  // read data 
  app.get("/read", async (req, res) => {
    UserModel.find({}, (error, result) => {
      if (error) {
        res.send(error);
      }
      res.status(200).send(result);
    });
  });
  app.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    await UserModel.findByIdAndRemove(id).exec();
    res.send("deleted");
  });

  // update 
  app.put("/update/:id", async (req, res) => {
    try {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true }
      );
      res.send(updatedUser);
    } catch (error) {
      console.error(error);
    }
  });
 
  //get single user
  app.get("/user/get/:id", async (req, res) => {
    try {
      const users = await UserModel.findById(req.params.id);
  
      res.send(users);
    } catch (error) {
      console.error(error);
    }
  });
  // filter data between two dates 
  app.get("/search/:date1/:date2", async (req, res) => {
    const users = await UserModel.find();
    console.log(users);
    let date1 = Date.parse(req.params.date1);
    let date2 = Date.parse(req.params.date2);
  
    const filtredUsers = users.filter((user) => {
      return (
        Date.parse(user.dateDemarrage) < date2 &&
        date1 < Date.parse(user.dateDemarrage)
      );
    });
    console.log(filtredUsers);
    res.status(200).json(filtredUsers);
  });
  module.exports=app;