const mongoose = require('mongoose')
const { model, Schema} =  mongoose

userSchema = new Schema({
     userName: String,
     companyName :String,
     email : String,
     mobileNo : Number,
     password: String,
     role :  String
    }, {timestamps: true})

const User = model('User', userSchema)

 module.exports = User
     
