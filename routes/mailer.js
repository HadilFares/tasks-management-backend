const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const router = require("express").Router();

dotenv.config();
const sendMail = (user, callback) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Hadouul", "hedilfares30@gmail.com"`,
     to: `${user.user.email}`,
    
    subject: "Confirmation",
    html: `<h1>Welcome To Our team <3</h1><br>
            http://localhost:3001/generatepassword/${user.id}`,
  };
  transporter.sendMail(mailOptions, callback);
};

router.post("/sendmail", (req, res) => {
  console.log("request came");
  const user ={ ...req.body, id : req.body.id.data.id};
  console.log(user.user.email)
 sendMail(user, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400).json({ msg: "Failed to send email" });
    } else {
      console.log("Email has been sent");
      res.status(200).json({ msg: info });
    }
  });
});

module.exports = router;
