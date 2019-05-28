var express = require('express');
var router = express.Router();
let Request = require('../models/Requests');
let Card = require('../models/Cards');
let Student = require('../models/Users');
//GET ALL CARD INFORMATION API
router.get('/', function (req, res, next) {
    Card.find({}, function (err, cards) {
        if (err) {
            console.error(err)
            res.send(err)
        } else {
            res.send(cards)
        }
    })
})

//GET ALL CARD CREATION REQUEST
router.get('/request', function (req, res, next) {
    Card.find({
        userID: ""
    }, function (err, cards) {
        if (err) {
            console.error(err)
            res.send(err)
        } else {
            res.send(cards)
        }
    })
})

//DELETE ALL CARDS API
router.delete('/delete', function (req, res, next) {
    Card.deleteMany({}, function (err, cards) {
        if (err) {
            console.error(err)
            res.send("Something went wrong")
        } else {
            res.send("Complete")
        }
    })
})

//CREATE MASTER CARD API
router.post('/issue/master', function (req, res, next) {
    let mastercard = new Card({
        master: true,
        UID: req.body.UID,
        status: "Active",
        balance: 0,
        created_date: new Date(),
        activated_date: new Date(),
        exprire_date: "",
        userID: req.body.userID
    })
    mastercard.save(function (err) {
        if (err) {
            let response = {
                insert_master: false
            }
            console.error(err)
            res.send(response)
        } else {
            let response = {
                insert_master: true
            }
            res.send(response)
            console.log(`A master card has been created`)
        }
    })
})

//CHECK MASTER CARD API
router.get('/check/master/UID/:UID', function (req, res, next) {
    Card.findOne({
        master: true,
        UID: req.params.UID
    }, function (err, card) {
        if (err) {
            console.error(err)
            res.send("Something went wrong")
        } else {
            if (card) {
                let response = {
                    master: true,
                }
                res.send(response)
            } else {
                let response = {
                    master: false,
                }
                res.send(response)
            }
        }
    })
})

//ADD NEW BLANK CARD
router.get('/issue/blank/UID/:UID', function (req, res, next) {
    let card = new Card({
        card_number: "",
        UID: req.params.UID,
        status: "Inactive",
        balance: 0,
        created_date: new Date(),
        activated_date: "",
        expire_date: "",
        userID: "",
        master: false
    })
    card.save(function (err) {
        if (err) {
            let response = {
                status: false,
            }
            console.error(err)
            res.send(response)
        } else {
            let response = {
                status: true,
            }
            console.log('A new blank card has been created')
            res.send(response)
        }
    })
    // ALSO ADD NEW REQUEST 
    let newRequest = new Request({
        type: 'Create',
        content: 'Require to update user ID for new card',
        status: 'New',
        priority: 'High',
        providerID: '',
        adminID: '',
        userID: '',
        card_UID: req.params.UID,
        received_date: new Date(),
        sender: "Station Owner"
    })
    newRequest.save()
})

//ADD USER ID FOR CARD API
router.put('/update/UID/:UID/userID/:userID', async function (req, res, next) {
    const req_id = req.query.req_id;
    // const userID=req.params.userID;
    await Card.findOneAndUpdate({
            UID: req.params.UID
        }, {
            userID: req.params.userID
        })
        .exec()
        // await 
        .then(async card=> {
                if (card) {
                    await Request.findOneAndUpdate({
                        _id: req_id
                    }, {
                        status: 'Resolved'
                    })
                    .exec()
                    .then(
                         async req =>{
                            if(req){}
                            else {
                                await res.status(500).json({
                                    message:"No request with this id"
                                })
                            }
                        }
                    )
                    await Student.findOneAndUpdate({
                        studentID: req.params.userID
                    }, {
                        card_number: card.card_number,
                        card_id:card._id,
                        card_UID:card.UID
                    })
                    .exec()
                    .then(
                        async student =>{
                            if(student){
                                await res.status(200).json({
                                    message:"card has been update"
                                })
                            }
                            else {
                                await res.status(500).json({
                                    message:"No student with this id"
                                })
                            }
                        }
                    )
                    .catch(err => {
                        res.status(500).json({
                            error: err.message
                        })
                    })
                }
                else{
                    await res.status(500).json({
                            message:"No card with this uid"
                    })
                } 
        })
        .catch(err => {
                        res.status(500).json({
                            error: err.message
                        })
        })
    
})

//DELETE CARD BY UID
router.delete('/delete/UID', function (req, res, next) {
    Card.findOneAndDelete({
        UID: req.body.UID
    }, function (err, card) {
        if (err) {
            res.send("There is something wrong")
            console.error(err)
        } else {
            res.send("Delete Successfully")
        }
    })
})
//DELETE CARD BY _id
router.delete('/', function (req, res, next) {
    Card.findOneAndDelete({
        _id: req.query.id
    }, function (err, card) {
        if (err) {
            res.send("There is something wrong")
            console.error(err)
        } else {
            res.send("Delete Successfully")
        }
    })
})

//GET list card included paginate
router.get('/listcard', function (req, res, next) {
    const page = req.query.page;
    Card.paginate({}, {
        page: page,
        limit: 5
    }, function (err, result) {
        res.send({
            docs: result.docs,
            total: result.total,
            pages: result.pages
        })
    })
    // res.send("ok")
})

//GET card by _id  
router.get('/detail', function (req, res, next) {
    let id = req.query.id;
    Card.findById(id, async function (err, card) {
        await Student.findOne({
            studentID: card.userID
        }, async function (err, user) {
            if (err) {
                console.error(err)
                res.send("Something went wrong")
            } else if (user) {
                let data =await Object.assign(card.toObject(), {
                    user_name: user.name,
                    // created_date:card.created_date.toDateString(),
                    // expire_date:card.expire_date.toDateString()
                })
                res.send(data)
            } else {
                res.send("Wrong user or password")
            }
        });

    });
})




module.exports = router;