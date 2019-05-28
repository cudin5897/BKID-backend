var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
const secret = "mysecretsshhh";



mongoose.connect('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
  if (err)
    console.error(err);
  else console.log("Provider router connects successfully to mLab")
})


//SCHEMAS
let serviceProvidersSchema = new mongoose.Schema({
  name: String,
  email: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  phone: String,
  date_of_birth: Date,
  address: String,
  firm: String,
  status: {
    type: String,
    enum: ["Active", "Inactive"]
  },
  password: String
})

serviceProvidersSchema.plugin(mongoosePaginate);

let serviceProviders = mongoose.model('Provider', serviceProvidersSchema);

// CREATE NEW PROVIDER
router.post('/create', (req, res, next) => {
  const hashedPassword = passwordHash.generate( req.body.password);
  let newProvider = new serviceProviders({
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    phone: req.body.phone,
    date_of_birth: req.body.date_of_birth,
    address: req.body.address,
    firm: req.body.firm,
    status: "Active",
    password: hashedPassword
  })
  newProvider.save(function (err) {
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
      res.send(response)
      console.log("A provider has been created")
    }
  })
})

//LOGIN PROVIDER
router.post("/login", async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const result = await serviceProviders.findOne({
    email: email
  });
  if(result===null){
    await res.send({_id:null})
  }
  if (await passwordHash.verify(password, result.password) == true) {

    // res.send("OK")
    // res.cookie("token", token, { httpOnly: true }).sendStatus(200);
    await res.send(result)
  } else {
    await res.send({_id:null});
  }
});

//GET service provider list
router.get('/', (req, res, next) => {
  serviceProviders.find({}, (err, providers) => {
    if (err) {
      console.error(err)
      res.send("Something went wrong")
    } else {
      res.send({
        list_provider: providers,
        length: providers.length
      })
    }
  })
})

//GET serivce provider included paginate
router.get('/listprovider',function(req,res,next){
  const page=req.query.page;
  serviceProviders.paginate({},{
    page:page,
    limit:5
  },function(err,result){
      res.send({
        docs:result.docs,
        total:result.total,
        pages:result.pages
      })
    }) 
  })

//DELETE 1 provider by its ID
router.delete("/", function(req, res, next) {
  let id = req.query.id;
  serviceProviders.deleteOne({ _id:id }, function(err) {
      if (!err) {
             res.send({message:'notification!'}) ;
      }
      else {
             res.send({message:'error!'}) ;
      }
  });
});


//GET USER by _id  
router.get('/detail', function (req, res, next) {
  let id=req.query.id;
  serviceProviders.findById(id,function(err,doc){
      res.send({
          result:doc
          // status:"ok"
      });
  });
})

module.exports = router;