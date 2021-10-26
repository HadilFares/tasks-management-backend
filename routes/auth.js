const router = require("express").Router();
const UserModel = require("../models/User");
const { registerValidation, loginValidation } = require("./validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const dotenv = require("dotenv");

router.post("/register", async (req, res) => {
  //lets validate the data before we a user
  const { name, lastname, email, password, verifPassword } = req.body;

  const { error } = registerValidation({
    name,
    lastname,
    email,
    password,
    verifPassword,
  });
  if (error) return res.status(400).json({ msg: "error" });
  //EMAIL DOESN'T EXIST
  const emailExist = await UserModel.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).json({ msg: "email already exists" });
  // hash the passwords

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  try {
    console.log(req.body);
    if (password != verifPassword)
      return res.status(400).json({ msg: "passsword not valid" });

    const user = new UserModel({
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
    });

    console.log(user);
    const savedUser = await user.save();
    res.send("user saved seccessfuly");
  } catch (err) {
    res.status(400).json({ msg: err });
  }
});

router.post("/login", async (req, res) => {
  //validate the data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({msg : error.details[0].message});
  //Email doesn't exist
  const user = await UserModel.findOne({ email: req.body.email });
  console.log(user);
  if (!user)
    return res.status(400).json({ msg : "email or password doesn't exists" });
 //

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({msg : "Invalide password"});

  //create token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  console.log(token);
  res.status(200).json({token: token,id : user._id ,isAdmin : user.isAdmin,name : user.name})
 // res.header("auth-token", token).send(token);
});


router.get("/logout", async (req, res) => {
  req.session.destroy();
});

module.exports = router;
