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
                default : 1
            }}],
    TotalPrice : Number,
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active'
    }
    },{timestamps : true})

const Cart = model('Cart',cartSchema)
module.exports = Cart;