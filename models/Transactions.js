var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
  if (err) 
  console.error(err);
  else console.log("User router connects successfully to mLab")
})

//SCHEMAS
let transactionSchema = new mongoose.Schema({
    card_UID:{
        type:String
    },
    time:{
        type:Date
    },
    stationID:{
        type:String
    },
    service_packageID:{
        type:String
    },
    product:[{
        productID:String,
        unit:Number
    }],
    total_price:{
        type:Number
    }
})
transactionSchema.plugin(mongoosePaginate);

//MODELS
let Transaction = mongoose.model('Transaction', transactionSchema);

module.exports= Transaction