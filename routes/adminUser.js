var express = require("express");
var router = express.Router();
let mongoose = require("mongoose");
var passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const withAuth = require('./middleware');


mongoose.connect(
  "mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid",
  err => {
    if (err) console.error(err);
    else console.log("Admin router connects successfully to mLab");
  }
);

const USER_NAME_MIN_LENGTH = 3;
const USER_NAME_MAX_LENGTH = 10;
const PASSWORD_MIN_LENGTH = 3;
const PASSWORD_MAX_LENGTH = 10;
const EMAIL_MIN_LENGTH = 5;
const PHONE_MIN_LENGTH = 9;
const PHONE_MAX_LENGTH = 15;
const secret = "mysecretsshhh";

const AdminUser = mongoose.model("AdminUser", {
  userName: {
    type: String,
    min: USER_NAME_MIN_LENGTH,
    max: USER_NAME_MAX_LENGTH
  },
  password: {
    type: String,
    min: PASSWORD_MIN_LENGTH,
    max: PASSWORD_MAX_LENGTH
  },
  email: {
    type: String,
    min: EMAIL_MIN_LENGTH
  },
  phone: {
    type: String,
    min: PHONE_MIN_LENGTH,
    max: PHONE_MAX_LENGTH
  },
  dateOfBirth: {
    type: Date
  },
  userType: {
    type: String,
    enum: ["systemAdmin", "serviceProvider", "endUser"]
  }
});

/*use GET to create simple account */
router.get("/create", function(req, res, next) {
  const date = new Date("1997-08-05");
  const hashedPassword = passwordHash.generate("trung5897");

  const newData = new AdminUser({
    userName: "Trung",
    password: hashedPassword,
    email: "trung5897@gmail.com",
    phone: "0947338777",
    dateOfBirth: date,
    userType: "systemAdmin"
  });
  newData.save();
  res.send("respond with a resource");
});

// POST create new account
router.post("/user", function(req, res, next) {
  const userName = req.body.userName;
  const password = req.body.password;
  const email = req.body.email;
  const phone = req.body.phone;
  const dateOfBirth = req.body.dateOfBirth;
  const userType = req.body.userType;
  const hashedPassword = passwordHash.generate(password);
  console.log(hashedPassword);
  const newData = new AdminUser({
    userName,
    password: hashedPassword,
    email,
    phone,
    dateOfBirth,
    userType
  });
  newData.save();
  res.send("create successfully");
});

// LOGIN admin API

router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const result = await AdminUser.findOne({
    email: email
  });
  console.log(result)
  // console.log(passwordHash.verify(password,result.password) );
  if(result==null){
    res.sendStatus(401)
  }
  else
  {
    passwordHash.verify(password, result.password) == true
    ? res.sendStatus(200)
    : res.sendStatus(401);
  }

    // if (passwordHash.verify(password, result.password) == true) {
    //   const payload = email;
    //   const token = await jwt.sign(
    //     payload,
    //     secret
    //   );
    //   res.cookie("token", token, { httpOnly: true }).sendStatus(200);
    // } else {
    //   res.sendStatus(401);
    // }
});

module.exports = router;
