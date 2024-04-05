const {validationResult } =require("express-validator")
const Product = require('../modules/product')
const Order = require('../modules/order')
const Cart = require('../modules/cart')
const orderCtlr ={}

orderCtlr.place = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return  res.status(401).json({errors : errors.array()})
    }
    try{
        const cart = await Cart.findOne({retailerId:req.currentUser.id} ).populate('products.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        console.log(cart)
        if (cart.orderPlaced) {
            return res.status(400).json({ message: 'An order has already been placed for this cart' });
        }
        console.log(cart.orderPlaced)
        let totalPrice = 0;
        for (const product of cart.products) {
            totalPrice += product.quantity * product.productId.B2Bprice;
        }
          const newOrder = new Order({
            retailerId:req.currentUser.id,
            products : cart.products.map((product)=>({
            productId: product.productId._id,
            price: product.productId.B2Bprice,
            quantity : product.quantity
           })),
            totalPrice,
            status:'Confirm'
        })
        console.log(newOrder)
        await newOrder.save()
        await Order.updateOne({ _id: newOrder._id }, { status: 'Confirm' });

        cart.orderPlaced = true;
        console.log(cart.orderPlaced);
        console.log(Order)
        await cart.save();
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    }
    catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

orderCtlr.details = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        if (order.retailerId.toString() !== req.currentUser.id) {
            return res.status(403).json({ message: 'You are not authorized to access this order' });
        }
        res.status(200).json({ order });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


orderCtlr.lists=async (req, res) => {
    try {
        const retailerId = req.currentUser.id;
        const orders = await Order.find({ retailerId });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this retailer' });
        }
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
module.exports=orderCtlr