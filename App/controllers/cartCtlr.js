const Cart = require('../modules/cart')
const {validationResult} = require('express-validator')
const Product = require('../modules/product')

const cartCtlr ={}
 
cartCtlr.addToCart =async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {  products } = req.body;
    try {
        let totalPrice = 0;
        if (products && products.length > 0) {
            for (const product of products) {
                totalPrice += product.quantity * product.B2Bprice;
            }
        } else {
            throw new Error('No products found in the request');
        }
        const newCart = new Cart({
            retailerId: req.user._id,
            products,
            totalPrice,
        });
        await newCart.save();
        await Cart.updateOne({ _id: newCart._id }, { status: 'active' });
        res.status(201).json({ message: 'Items added to cart successfully', cart: newCart });
    } catch (error) {
        console.error('Error adding items to cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

cartCtlr.details = async(req, res)=>{
    try {
        const cartDetails = await Cart.find({ retailerId: req.user._id }).populate('products.productId');
        res.status(200).json({ cartDetails });
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

cartCtlr.delete = async (req, res) => {
    try {
        const productId = req.params.productId;
        const retailerId = req.user._id;
        const cart = await Cart.findOne({ retailerId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const productIndex = cart.products.findIndex(product => product.productId === productId);

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in the cart' });
        }
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.status(200).json({ message: 'Product deleted from the cart successfully', cart });
    } catch (error) {
        console.error('Error deleting product from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

cartCtlr.Update = async (req, res) => {
    try {
        const productId = req.params.productId;
        const retailerId = req.user._id;
        const { quantity } = req.body;

        const cart = await Cart.findOne({ retailerId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = cart.products.find(product => product.productId === productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found in the cart' });
        }

        const dbProduct = await Product.findById(productId);
        if (!dbProduct) {
            return res.status(404).json({ message: 'Product not found in the database' });
        }

        let updatedQuantity = quantity;
        if (updatedQuantity > dbProduct.stock) {
            updatedQuantity = dbProduct.stock; 
        }
        product.quantity = updatedQuantity;
        await cart.save();
        await Cart.updateOne({ _id: cart._id }, { status: 'active' });
        res.status(200).json({ message: 'Product quantity updated successfully', cart });

    } catch (error) {
        console.error('Error updating product quantity:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = cartCtlr