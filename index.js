const express = require("express");
const mongoose = require('mongoose');
const moment = require("moment");
const cors = require("cors");
var path = require("path");
var xlsx = require("xlsx");
const bcrypt = require("bcrypt");
const app = express();
//const dotenv= require('dotenv');
const UserModel = require("./models/User");
const TaskModel=require("./models/Task");

const { send } = require("process");
const { Console } = require("console");
//Import Routes 
const authRoute=require('./routes/auth');
const sendMail = require('./routes/mailer');
require('dotenv').config();

// connect to db
mongoose.connect(process.env.DB_CONNECT,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
},()=>console.log('connected to db'));

// Middleware
app.use(express.json());
//Route Middleware
app.use('/api/user',authRoute);
app.use('/api',sendMail);
app.use(cors());



app.use(express.static(path.resolve(__dirname, "public")));

app.post("/create", async (req, res) => {
  let {matricule ,email , name, lastname , dateDemarrage} = req.body;
  const newUser = new UserModel({
    matricule: matricule,
    email : email,
    name: name,
    lastname: lastname,
    dateDemarrage: dateDemarrage,
  });
  try {
    await newUser.save();
    res.status(200).json({id :newUser._id});
  } catch (error) {
    console.error(error);
  }
});


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

app.put("/update/:id", async (req, res) => {
  try {
    if (req.body.password){
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
///////////////Tasks///////////
//create task
app.post("/tasks",async(req,res)=>{
  
  const task=new TaskModel({
  Title:req.body.Title,
  DateDebut:req.body.DateDebut,
  DateDebutPr:req.body.DateDebutPr,
  DateFin:req.body.DateFin,
  DateFinPr:req.body.DateFinPr,
  IdPersonne:req.body.IdPersonne,
  Description:req.body.Description,
  Priority:req.body.Priority,
  Status:req.body.Status
   
  });
  try {
    await task.save();
    res.status(201).send(task);
  }
  catch(error){
    res.status(400).send(error);
  }
});
//getTask
app.get("/tasks/:id",async(req,res)=>{
  try{
 const tasks=  await TaskModel.findById(req.params.id);
 res.status(201).send(tasks);
}
catch (error){
  res.status(400).send(error);
}
});
//read Tasks
app.get("/read/tasks",async(req,res)=>{
  TaskModel.find({},(error,result)=>{
    if(error){
      res.send(error);
    }
    res.status(201).send(result);
  });
});
//delete task
app.delete("/delete/task/:id",async(req,res)=>{
  const id =req.params.id;
  await TaskModel.findByIdAndRemove(id).exec();
  res.send("deleted");
});
//edit task
app.put("/update/task/:id",async(req,res)=>{
  try{
    const updatedTask=await TaskModel.findByIdAndUpdate(
      req.params.id,
      {...req.body},
      {new:true}

    );
    res.status(201).send(updatedTask);

  }catch (error){
    res.status(400).send(error);
  }
});


app.listen(3000, () => {
  console.log("Server running on port 3000 ... ");
});
