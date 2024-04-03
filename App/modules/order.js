const { Schema , model} =require('mongoose')

const orderSchema = new Schema({
    retailerId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
    },
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
        },
        quantity: Number,
        }],
    totalPrice:Number,
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered'],
        default: 'pending'
    },
},{timestamps:true});

const Order = model('Order', orderSchema)
module.exports = Order