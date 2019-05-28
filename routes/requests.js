var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Request = require("../models/Requests");
var Student = require('../models/Users');

mongoose.connect(
  "mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid",
  err => {
    if (err) console.error(err);
    else console.log("Provider router connects successfully to mLab");
  }
);

// CREATE NEW PROVIDER
router.post("/create", (req, res, next) => {
  let newRequest = new Request({
    type: req.body.type,
    content: req.body.content,
    status: req.body.status,
    priority: req.body.priority,
    providerID: req.body.providerID,
    adminID: req.body.adminID,
    userID: req.body.userID,
    card_UID: req.body.card_UID,
    received_date: new Date(),
    sender: req.body.sender
  });
  newRequest.save(function(err) {
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
      console.log("A request has been created");
    }
  });
});

//GET serivce provider included paginate
router.get("/listrequest", function(req, res, next) {
  const page = req.query.page;
  Request.paginate(
    {},
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

//UPDATE request status
router.put("/", function(req, res, next) {
  const id = req.query.id;
  Request.findByIdAndUpdate(
    id,
    {
      status: req.body.status
    },
    function(err, doc) {
      res.send("Status has been updated");
    }
  );
});

//GET 1 request by its ID
router.get("/detail", function(req, res, next) {
  let id = req.query.id;
  Request.findById(id, async function(err, doc) {
    let data = await Object.assign(doc.toObject(), {
      received_date: doc.received_date.toDateString()
    });
    res.send({
      result: data
      // status:"ok"
    });
  });
});

//DELETE 1 request by its ID
router.delete("", function(req, res, next) {
  let id = req.query.id;
  Request.remove({ _id:id }, function(err) {
      if (!err) {
             res.send({message:'notification!'}) ;
      }
      else {
             res.send({message:'error!'}) ;
      }
  });
});


module.exports = router;
