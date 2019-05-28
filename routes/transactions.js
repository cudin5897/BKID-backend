let express = require("express");
let router = express.Router();
let mongoose = require("mongoose");
var Transaction = require('../models/Transactions');


//CREATE new station account
router.post("/:UID", (req, res, next) => {
  let transaction = new Transaction({
    card_UID: req.params.UID,
    time:new Date(),
    stationID:req.body.stationID,
    service_packageID:req.body.service_packageID,
    product:req.body.product,
    total_price:req.body.total_price
  });
  transaction.save(err => {
    if (err) {
      console.error(err);
      res.send("Something went wrong");
    } else {
      res.send("Complete");
    }
  });
});

//GET transactions length
router.get("/length", (req, res, next) => {
    Transaction.find({}, (err, transaction) => {
      if (err) {
        console.error(err);
        res.send("Something went wrong");
      } else {
        res.send({
          list_transaction: transaction,
          length: transaction.length
        });
      }
    });
});
//GET serivce provider included paginate
router.get("/listtransaction/:UID", function(req, res, next) {
  const card_UID = req.params.UID;
  const page=req.query.page;
  Transaction.paginate(
    {card_UID},
    {
      page: page,
      limit: 10
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
//GET serivce provider included paginate
router.get("/station", function(req, res, next) {
    Transaction.find({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
        res.send(post)
    });
  // res.send("ok")
});
//GET serivce provider included paginate
router.get("/stationID/:stationID", function(req, res, next) {
  const stationID=req.params.stationID;
    Transaction.find({stationID:stationID}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
        res.send(post)
    });
  // res.send("ok")
});

//GET serivce provider included paginate
router.get("/latest/:UID", function(req, res, next) {
  const card_UID = req.params.UID;
    Transaction.findOne({card_UID}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
        res.send(post)
    });
  // res.send("ok")
});




module.exports = router;
