const mongoose = require('mongoose')
const { model, Schema } = require("mongoose");

const productSchema =new Schema({
    productName : String,
    categoryId : {
       type : Schema.Types.ObjectId,
       ref  : 'Category'
     },
    Mrp:Number,
    B2Bprice : Number,
    Discount : Number,
    image : [],
    Stock: Number,
    description : String,
    expirydays : Number,
    isDeleted : {type : Boolean, default : false},
    deletedAt : {type : Date, default : null}
},{timestamps : true})

const Product = model('Product',productSchema)

module.exports = Product