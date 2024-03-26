const {model , Schema} = require('mongoose')

const cartSchema =new Schema({
    retailerId : {
        type : Schema.Types.ObjectId,
        ref  : 'User'
    },
    products :[{
            type : Schema.Types.ObjectId,
            ref  : 'Product'
          }],
    quantity : {
        type : Number ,
        default : 1
    }      
    
},{timestamps : true})

const Cart = model('Cart',cartSchema)
module.exports = Cart