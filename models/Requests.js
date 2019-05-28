var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
    if (err)
        console.error(err);
    else console.log("Provider router connects successfully to mLab")
})


//SCHEMAS
let requestSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Lock", "Create", "Another"]
    },
    content: String,
    status: {
        type: String,
        enum: ["New", "In-Progress", "Resolved"]
    },
    priority: {
        type: String,
        enum: ["High", "Low"]
    },
    card_UID:String,
    providerID: String,
    adminID: String,
    userID: String,
    received_date:Date,
    sender:String
})

requestSchema.plugin(mongoosePaginate);

let Request = mongoose.model('Request', requestSchema);

module.exports= Request