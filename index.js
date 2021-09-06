const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const cors = require("cors");
var path = require("path");
var xlsx = require("xlsx");
const app = express();
const UserModel = require("./models/User");
const User = require("./models/User");
const { send } = require("process");
const { Console } = require("console");
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://localhost:27017/crudApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(path.resolve(__dirname, "public")));

app.post("/create", async (req, res) => {
  const matricule = req.body.matricule;
  const name = req.body.name;
  const lastname = req.body.lastname;
  const dateDemarrage = req.body.dateDemarrage;
  const newUser = new UserModel({
    matricule: matricule,
    name: name,
    lastname: lastname,
    dateDemarrage: dateDemarrage,
  });
  try {
    await newUser.save();
    res.send("inserted data");
  } catch (error) {
    console.error(error);
  }
});

app.get("/read", async (req, res) => {
  UserModel.find({}, (error, result) => {
    if (error) {
      res.send(error);
    }
    res.send(result);
  });
});
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await UserModel.findByIdAndRemove(id).exec();
  res.send("deleted");
});

app.put("/update/:id", async (req, res) => {
  try {
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

app.get("/user/:id", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.send(users);
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
/*
app.get("/search/:date1/:date2", async (req, res) => {
   
    const date1 =new Date().startOf('month').toDate();
    const date2 =new Date().endOf('month').toDate();

    try {
        let filtredUsers = await UserModel.find({created_at:{$gte:2021-08-12,$lte:2021-08-10}}).pretty();
        console.log(filtredUsers);
        res.status(525).send(filtredUsers)
    } catch (error) {
       return  res.status(400).json({ 'msg': "error" });
    }

})*/

app.get("/search/:date1/:date2", async (req, res) => {
  const users = await UserModel.find();
 /* const users = [
    {
      _id: { $oid: "6123aba4012e2c35a41c16d0" },
      matricule: "104",
      name: "fhhf",
      lastname: "ttt",
      dateDemarrage: { $date: "2021-08-15T00:00:00.000Z" },
      __v: 0,
    },
    {
      _id: { $oid: "61260eee5687641f4c70ea28" },
      matricule: "100",
      name: "hadil",
      lastname: "fares",
      dateDemarrage: { $date: "2021-08-11T00:00:00.000Z" },
      __v: 0,
    },
  ];*/

  console.log(users)
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



app.listen(3000, () => {
  console.log("Server running on port 3000 ... ");
});
