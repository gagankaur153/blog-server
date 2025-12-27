const mongoose = require('mongoose')

const userschema = new mongoose.Schema({
    username: {
        type:String, required: true
    },
    email: {
        type:String, unique: true, required: true
    },
    password:{
        type:String, required: true
    },
    role: {
       type:String, enum:["user","admin"], default: "user"
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userschema)
module.exports =  User