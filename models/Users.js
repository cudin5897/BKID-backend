var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

mongoose.connect('mongodb://admin:admin123451@ds137763.mlab.com:37763/bkid', (err) => {
  if (err) 
  console.error(err);
  else console.log("User router connects successfully to mLab")
})

//SCHEMAS
let studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"]
  },
  phone: String,
  date_of_birth: Date,
  type: {
    type:String,
    enum:["Regular", "Premium"]
  },
  address: String,
  firm: String,
  status: String,
  password: String,
  job: String,
  payment_method: String,
  studentID: String,
  group:String,
  card_number:String,
  card_UID:String,
  card_id:String,
  service:[{
    service_name:String,
    service_ID:String,
    servicePackage_ID:String
  }]
})
studentSchema.plugin(mongoosePaginate);

//MODELS
let Student = mongoose.model('Student', studentSchema);

module.exports= Student