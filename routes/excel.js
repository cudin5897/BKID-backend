let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let xlsx = require('node-xlsx').default;


mongoose.connect('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
    if (err)
        console.error(err);
    else console.log("Room router connects successfully to mLab")
})


//SCHEMA
let targetObjectSchema = new mongoose.Schema({
    name: {
        type: String
    },
    id: {
        type: String
    },
    group: {
        type: String
    }
});

//MODEL
let targetObject = mongoose.model('excel', targetObjectSchema);

//const workSheetsFromFile = xlsx.parse(`/home/ductrung/Desktop/student.xlsx`);

//GET 
router.get('/', (req, res, next) => {
    console.log(workSheetsFromFile);
    res.send(workSheetsFromFile);
})


module.exports = router;