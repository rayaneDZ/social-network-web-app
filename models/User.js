const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : {type : String, required : true, unique : true},
    email : {type : String, required : true, unique : true},
    hashed_password : {type : String, required : true},
    realname : String,
    gender : {type: String, required : true},
    city : String,
    country : String,
    profile_picture_path : {type : String, default : ''},
    pp_uuid : {type : String, default : ''},
    birth_date : Date,
    posts : { type : Array, default : []},
    joining_date : {type: Date, default: Date.now},
    status : Boolean
});

module.exports = mongoose.model('User', userSchema);