let mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-auto-increment');



var connection =mongoose.createConnection('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
    if (err)
        console.error(err);
    else console.log("Card router connects successfully to mLab")
})
autoIncrement.initialize(connection);

//SCHEMAS
let cardSchema = new mongoose.Schema({
    card_number: {
        type:Number
    },
    UID: {
        type:String,
        // unique:true
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"]
    },
    balance: Number,
    created_date: Date,
    activated_date: Date,
    expire_date: Date,
    userID: String,
    master: Boolean
})
cardSchema.plugin(mongoosePaginate);
cardSchema.plugin(autoIncrement.plugin, {
    model: 'Card',
    field: 'card_number',
    startAt: 100,
    incrementBy: 100
});//MODEL
let Card = mongoose.model('Card', cardSchema);

module.exports= Card