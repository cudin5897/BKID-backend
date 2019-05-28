var express = require("express");
var router = express.Router();
var Student = require("../models/Users");

// CREATE NEW STUDENT
router.post("/create", (req, res, next) => {
  let student = new Student({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    phone: req.body.phone,
    date_of_birth: req.body.date_of_birth,
    type: req.body.type,
    address: req.body.address,
    firm: req.body.firm,
    status: "active",
    password: req.body.password,
    job: req.body.job,
    payment_method: "",
    studentID: req.body.studentID,
    card_number: "",
    card_UID: req.body.card_UID
  });
  student.save(function(err) {
    if (err) {
      let response = {
        status: false
      };
      console.error(err);
      res.send(response);
    } else {
      let response = {
        status: true
      };
      res.send(response);
      console.log("A student has been created");
    }
  });
});
     
// CREATE NEW STUDENT
router.post("/createmany", async (req, res, next) => {
  const list_user = req.body;
  await list_user.map(async user => {
    

    await Student.create({
       name: user.name,
      email: user.email,
      gender: user.gender,
      phone: user.phone,
      date_of_birth: user.date_of_birth,
      // type: user.type,
      address: user.address,
      firm: user.firm,
      status: "Active",
      password: "12345",
      job: user.job,
      payment_method: "",
      studentID: user.studentID,
      card_number: "",
      card_UID: ""
    })
    // .exec()
    .then()
  })
  
  res.send("ok");
});

// update student
router.put("/", (req, res, next) => {
  const id = req.query.id;
  Student.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      email: req.body.email,
      gender: req.body.gender,
      phone: req.body.phone,
      date_of_birth: req.body.date_of_birth,
      type: req.body.type,
      address: req.body.address,
      firm: req.body.firm,
      status: "active",
      password: req.body.password,
      job: req.body.job,
      payment_method: "",
      studentID: req.body.studentID,
      card_number: ""
    },
    function(err, user) {
      if (err) {
        console.error(err);
        res.send("Something went wrong");
      } else if (user) {
        res.send(user);
      } else {
        res.send("Wrong user or password");
      }
    }
  );
});

// SUBCRIBE SERVICE PACKAGE
router.post("/subcribe", function(req, res, next) {
  var service = {
    service_name: req.body.serviceName,
    service_ID: req.body.serviceID,
    servicePackage_ID: req.body.packageID
  };
  Student.findOneAndUpdate(
    {
      studentID: req.body.userID
    },
    {
      $push: { service: service }
    },
    function(err, students) {
      if (err) {
        console.error(err);
        res.send("Something went wrong");
      } else {
        if (students) {
          res.send("Subcribe successfully");
        } else {
          res.send(`There is no user has ${req.body.userID}`);
        }
      }
    }
  );
});

// LOGIN USER
router.post("/login", function(req, res, next) {
  Student.findOne(
    {
      studentID: req.body.studentID,
      password: req.body.password
    },
    function(err, user) {
      if (err) {
        console.error(err);
        res.send("Something went wrong");
      } else if (user) {
        res.send(user);
      } else {
        res.send("Wrong user or password");
      }
    }
  );
});

//DELETE 1 request by its ID
router.delete("/", function(req, res, next) {
  let id = req.query.id;
  Student.deleteOne({ _id: id }, function(err) {
    if (!err) {
      res.send({ message: "notification!" });
    } else {
      res.send({ message: "error!" });
    }
  });
});

//GET A LIST OF STUDENT WITH PAGINATION
router.get("/liststudent", function(req, res, next) {
  Student.paginate(
    {
      job: "Student"
    },
    {
      limit: 5
    },
    function(err, result) {
      res.send({
        docs: result.docs,
        total: result.total,
        pages: result.pages
      });
    }
  );
});

//GET NUMBER OF STUDENTS
router.get("/", function(req, res, next) {
  Student.find(
    {
      job: "Student"
    },
    function(err, users) {
      if (err) {
        console.error(err);
        res.send("Something went wrong");
      } else {
        res.send({
          list_student: users,
          length: users.length
        });
      }
    }
  );
});

//GET USER by _id
router.get("/detail", function(req, res, next) {
  let id = req.query.id;
  Student.findById(id, function(err, doc) {
    res.send({
      result: doc
      // status:"ok"
    });
  });
});

module.exports = router;
