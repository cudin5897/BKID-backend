let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
var Student = require('../models/Users');

mongoose.connect(
  "mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid",
  err => {
    if (err) console.error(err);
    else console.log("Station router connects successfully to mLab");
  }
);

//SCHEMAS
let stationSchema = new mongoose.Schema({
  user_name: String,
  user_password: String,
  station_name: String,
  location: String,
  status: {
    type: String,
    enum: ["Active", "Inactive"]
  },
  providerID: String,
  service: {
    serviceID: String,
    service_name: String
  },
  service_package:[{
      service_packageID:String,
      service_package_name:String
  }]
});

//MODELS
let Station = mongoose.model("Station", stationSchema);


//CREATE new station account
router.post("/", (req, res, next) => {
  let station = new Station({
    user_name: req.body.user_name,
    user_password:req.body.user_password,
    station_name:req.body.station_name,
    location: req.body.location,
    status: "Active",
    providerID: req.body.providerID,
    service: req.body.service,
    service_package:req.body.service_package
  });
  station.save(err => {
    if (err) {
      console.error(err);
      res.send("Something went wrong");
    } else {
      res.send("Complete");
      console.log(`Station ${station.station_name} has been created`);
    }
  });
});

//LOGIN
router.post("/login", (req, res, next) => {
  Station.find(
    {
      username: req.body.username,
      password: req.body.password
    },
    (err, stations) => {
      if (err) {
        console.error(err);
        res.send("Something went wrong");
      } else {
        if (stations.length != 0) {
          res.send(stations[0]);
        } else {
          res.send("Wrong username or password");
        }
      }
    }
  );
});


//GET station list
router.get("/", (req, res, next) => {
  Station.find({}, (err, stations) => {
    if (err) {
      console.error(err);
      res.send("Something went wrong");
    } else {
      res.send({
        list_station: stations,
        length: stations.length
      });
    }
  });
});

//GET station list by providerID
router.get("/providerID/:providerID", (req, res, next) => {
  if (!req.query.status) {
    Station.find({ providerID: req.params.providerID }, (err, stations) => {
      if (err) {
        console.error(err);
        res.send("Something went wrong");
      } else {
        res.send({
          list_station: stations,
          length: stations.length
        });
      }
    });
  } else {
    Station.find(
      { providerID: req.params.providerID, status: req.query.status },
      (err, stations) => {
        if (err) {
          console.error(err);
          res.send("Something went wrong");
        } else {
          res.send({
            list_station: stations,
            length: stations.length
          });
        }
      }
    );
  }
});

//GET 1 station by its ID
router.get("/detail", function(req, res, next) {
  let id = req.query.id;
  Station.findById(id, async function(err, doc) {
    res.send(doc);
  });
});

//DELETE all stations
router.delete("/", (req, res, next) => {
  Station.deleteMany({}, (err, stations) => {
    if (err) {
      console.error(err);
      res.send("Something went wrong");
    } else {
      res.send("Delete complete");
    }
  });
});



module.exports = router;
