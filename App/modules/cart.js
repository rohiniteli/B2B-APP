const {model , Schema} = require('mongoose')

const cartSchema =new Schema({
    retailerId :{
        type : Schema.Types.ObjectId,
        ref  : 'User'
    },
    products :[{
            productId:{
                type : Schema.Types.ObjectId,
                ref  : 'Product' 
            },
            quantity : {
                type : Number,
                default :1
            },
            Mrp:Number,
            Discount:Number,
            B2Bprice: Number}],
    TotalPrice : Number,
    orderPlaced: {
        type: Boolean,
        default: false
    }
    },{timestamps : true})

const Cart = model('Cart',cartSchema)
module.exports = Cart;