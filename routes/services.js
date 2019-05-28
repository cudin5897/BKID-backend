var express = require("express");
var router = express.Router();
let mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");
var Student = require("../models/Users");
var Transaction = require("../models/Transactions");

mongoose.connect(
  "mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid",
  err => {
    if (err) console.error(err);
    else console.log("Services router connects successfully to mLab");
  }
);

//DECLARE DATA TYPE FOR SERVICE SCHEMA
let serviceSchema = new mongoose.Schema({
  name: {
    type: String
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"]
  },
  hasCheckinout: {
    type: Boolean
  },
  providerID: {
    type: String
  },
  created_date: {
    type: Date
  },
  description: {
    type: String
  }
});
serviceSchema.plugin(mongoosePaginate);

let Service = mongoose.model("Service", serviceSchema);

//DECLARE SCHEMA FOR INPUT LIST OBJECT
let Served_Object = new mongoose.Schema({
  obj_name: String,
  id: String,
  group: String
});

//DECLARE SCHEMA FOR SERVICE PACKAGE

let servicePackageSchema = new mongoose.Schema({
  name: {
    type: String
  },
  service_id: {
    type: String
  },
  price: {
    type: Number
  },
  quota_type: {
    type: String
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"]
  },
  active_time: {
    type: Number
  },
  inactive_time: {
    type: Number
  },
  active_duration: {
    type: Number //quota: days, example: 30 days
  },
  active_days_in_week: {
    type: [String]
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  },
  start_register_date: {
    type: Date
  },
  end_register_date: {
    type: Date
  },
  list_served_object: {
    type: [Served_Object]
  }
});
servicePackageSchema.plugin(mongoosePaginate);

let ServicePackage = mongoose.model("ServicePackage", servicePackageSchema);

// CREATE NEW SERVICE
router.post("/create", (req, res, next) => {
  let newService = new Service({
    name: req.body.name,
    status: "Active",
    hasCheckinout: req.body.hasCheckinout,
    providerID: req.body.providerID,
    created_date: new Date(),
    description: req.body.description
  });
  newService.save(function(err) {
    if (err) {
      let respone = {
        status: false
      };
      console.err(err);
      res.send(respone);
    } else {
      let respone = {
        status: true
      };
      res.send(respone);
      console.log("A service has been created");
    }
  });
});

//CREATE NEW PACKAGE
router.post("/create/package", (req, res, next) => {
  let newPackage = new ServicePackage({
    name: req.body.name,
    price: req.body.price,
    quota_type: req.body.quota_type,
    status: "Active",
    active_time: req.body.active_time,
    inactive_time: req.body.inactive_time,
    active_duration: req.body.active_duration,
    active_days_in_week: req.body.active_days_in_week,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    start_register_date: req.body.start_register_date,
    end_register_date: req.body.end_register_date,
    list_served_object: req.body.list_served_object,
    service_id: req.body.service_id
  });
  newPackage.save(function(err) {
    if (err) {
      let respone = {
        status: false
      };
      console.log(err);
      res.send(respone);
    } else {
      let respone = {
        status: true
      };
      res.send(respone);
      console.log("A package has been created");
    }
  });
});

//GET service  list
router.get("/", (req, res, next) => {
  Service.find({}, (err, services) => {
    if (err) {
      console.error(err);
      res.send("Something went wrong");
    } else {
      res.send({
        list_service: services,
        length: services.length
      });
    }
  });
});

//GET serivce  included paginate
router.get("/listservice", function(req, res, next) {
  const page = req.query.page;
  const providerID = req.query.providerid;
  Service.paginate(
    {
      providerID
    },
    {
      page: page,
      limit: 7
    },
    function(err, result) {
      res.send({
        docs: result.docs,
        total: result.total,
        pages: result.pages
      });
    }
  );
  // res.send("ok")
});

//GET service list by providerID
router.get("/providerID/:providerID", (req, res, next) => {
  if (!req.query.status) {
    Service.find({ providerID: req.params.providerID }, (err, services) => {
      if (err) {
        console.error(err);
        res.send("Something went wrong");
      } else {
        res.send({
          list_service: services,
          length: services.length
        });
      }
    });
  } else {
    Service.find(
      { providerID: req.params.providerID, status: req.query.status },
      (err, services) => {
        if (err) {
          console.error(err);
          res.send("Something went wrong");
        } else {
          res.send({
            list_service: services,
            length: services.length
          });
        }
      }
    );
  }
});

//GET serivce package by service id
router.get("/:service_id/package", function(req, res, next) {
  const service_id = req.params.service_id;
  ServicePackage.find({ service_id: service_id }, (err, package) => {
    if (err) {
      console.error(err);
      res.send("Something went wrong");
    } else {
      res.send({
        list_service_package: package,
        length: package.length
      });
    }
  });
});

//GET serivce package by service id included paginate
router.get("/listpackage", function(req, res, next) {
  const page = req.query.page;
  const id = req.query.id;
  ServicePackage.paginate(
    { service_id: id },
    {
      page: page,
      limit: 7
    },

    async function(err, result) {
      res.send({
        docs: result.docs,
        total: result.total,
        pages: result.pages
      });
    }
  );
  // res.send("ok")
});

//GET service by _id
router.get("/detail", function(req, res, next) {
  let id = req.query.id;
  Service.findById(id, function(err, doc) {
    res.send({
      result: doc
      // status:"ok"
    });
  });
});

//GET service package by _id
router.get("/servicepackage/detail", function(req, res, next) {
  let id = req.query.id;
  ServicePackage.findById(id, async function(err, package) {
    await Service.findById(package.service_id, async function(err, doc) {
      let data = await Object.assign(package.toObject(), {
        service_name: doc.name,
        start_date: package.start_date.toDateString(),
        end_date: package.end_date.toDateString(),
        start_register_date: package.start_register_date.toDateString(),
        end_register_date: package.end_register_date.toDateString()
      });
      res.send(data);
    });
  });
});

//CHECK STATION IN OUT
router.get("/check/:UID", async (req, res, next) => {
  let uid = req.params.UID;
  console.log(uid);
  let studentID;
  await Student.findOne({ card_UID: uid }, async function(err, doc) {
    console.log(doc);
    if (doc == null) {
      studentID = "";
    } else {
      studentID = doc.studentID;
    }
  });

  // console.log(studentID)

  let list_studentID;
  // // res.send("ok")
  let service_package_id = "5ccc601c6d3c21221d801abe";
  await ServicePackage.findById({ _id: service_package_id }, function(
    err,
    doc
  ) {
    list_studentID = doc.list_served_object;
    const result = list_studentID.find(item => item.id === studentID);
    let transaction = new Transaction({
      card_UID: req.params.UID,
      time: new Date(),
      stationID: req.body.stationID,
      service_packageID: req.body.service_packageID,
      product: req.body.product,
      total_price: req.body.total_price
    });
    transaction.save();

    // neu false thi la do chua co tai khoan voi studentID do
    res.send({
      check: result == null ? false : true
      // status:"ok"
    });
  });
});

//CHECK STATION IN OUT
router.get("/checknew/:UID/:stationID", async (req, res, next) => {
  let uid = req.params.UID;
  let stationID = req.params.stationID;
  // console.log(uid);
  let studentID;

  await Student.findOne({ card_UID: uid }, async function(err, doc) {
    // console.log(doc);
    if (doc == null) {
      studentID = "";
    } else {
      studentID = doc.studentID;
    }
  });

  let list_studentID;
  // // res.send("ok")
  ServicePackage.findOne()
    .sort({ field: "asc", _id: -1 })
    .limit(1)
    .exec(function(err, doc) {
      list_studentID = doc.list_served_object;
      const result = list_studentID.find(item => item.id === studentID);
      let transaction = new Transaction({
        card_UID: req.params.UID,
        time: new Date(),
        stationID: stationID,
        service_packageID: req.body.service_packageID,
        product: req.body.product,
        total_price: req.body.total_price
      });
      transaction.save();

      // neu false thi la do chua co tai khoan voi studentID do
      res.send({
        check: result == null ? false : true
        // status:"ok"
      });
    });
});

module.exports = router;
