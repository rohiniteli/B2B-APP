const Cart = require('../modules/cart')
const {validationResult} = require('express-validator')
const Product = require('../modules/product')

const cartCtlr ={}
 
cartCtlr.add =async(req,res)=>{
const errors = validationResult(req)
if(!errors){
    return  res.status(401).json({errors : errors.array()})
}
try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    const userId = req.currentUser.id; 
    let cart = await Cart.findOne({ retailerId: userId });

    if (!cart) {
        cart = new Cart({ retailerId: userId, products: [{ product: productId, quantity: 1 }] });
    } else {
        const existingProductIndex = cart.products.findIndex(item => item.product.equals(productId));
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }
    }
    await cart.save();
    res.status(200).json({ message: 'Product added to cart successfully', cart });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
}
}

module.exports = cartCtlr