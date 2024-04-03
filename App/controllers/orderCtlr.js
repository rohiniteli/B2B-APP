const {validationResult } =require("express-validator")
const Product = require('../modules/product')
const Order = require('../modules/order')
const Cart = require('../modules/cart')
const orderCtlr ={}

orderCtlr.place = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors){
        return  res.status(401).json({errors : errors.array()})
    }
    try{
        const retailerId = req.user._id
        const cart = await Cart.findOne({ retailerId }).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        let totalPrice = 0;
        for (const product of Cart.products) {
            totalPrice += product.quantity * product.productId.price;
        }
          const newOrder = new Order({
            retailerId,
            products : Cart.products.map((product)=>({
            productId: product.productId._id,
            price: product.productId.B2Bprice,
            quantity : product.quantity
          })),
            totalPrice,
            status,
        })
        await newOrder.save()
        await Order.updateOne({ _id: newOrder._id }, { status: 'confirmed' });
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    }
    catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

module.exports=orderCtlr