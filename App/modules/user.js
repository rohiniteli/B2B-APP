const mongoose = require('mongoose')
const { model, Schema} =  mongoose

userSchema = new Schema({
     userName: String,
     companyName :String,
     email : String,
     mobileNo : Number,
     password: String,
     role: {
        type: String,
        enum: ['admin','vendor','retailer', 'employee'],
        default: 'employee'
    },
    verified: {
        type: Boolean,
        default: function () {
            return this.role === 'employee' ? false : true
        }
    },
    address: {
        area : String,
        landmark : String,
        state: String,
        city: String,
        pincode: Number
    }                  
    }, {timestamps: true})

const User = model('User', userSchema)
module.exports = User
     
