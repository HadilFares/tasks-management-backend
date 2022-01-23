const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const cors = require("cors");
var path = require("path");
const app = express();


//Import Routes
//authentification routes (login ,register,logout )
const authRoute = require("./routes/auth");
// send mail
const sendMail = require("./routes/mailer");
require("dotenv").config();
// Statistics routes
const stat = require("./routes/statistics");
//User routes 
const user=require("./routes/user");
// task routes 
const task =require("./routes/task");
// connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  () => console.log("connected to db")
);

// Middleware
app.use(express.json());
//Route Middleware
//satitistics
app.use("/api", stat);
// user routes
// 
app.use("/",task)
app.use("/",user);
app.use("/api/user", authRoute);
app.use("/api", sendMail);
app.use(cors());

app.use(express.static(path.resolve(__dirname, "public")));


app.listen(3000, () => {
  console.log("Server running on port 3000 ... ");
});
