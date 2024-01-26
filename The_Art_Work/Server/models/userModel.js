const mongoose = require("mongoose");

const schema = mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    
})

const userSchema = mongoose.model("User", schema);
module.exports = userSchema;