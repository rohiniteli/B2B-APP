const Cart = require('../modules/cart')
const {validationResult} = require('express-validator')
const Product = require('../modules/product')

const cartCtlr ={}

cartCtlr.addToCart = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const body = req.body;
        const cartObj = { ...body };
        console.log(cartObj)
        const productIds = cartObj.products.map(ele => ele.productId);
        const cartProducts = await Promise.all(productIds.map(id => {
            return Product.findById(id);
        }));
        let totalPrice = 0;
        const updatedProducts = [];
        for (let i = 0; i < cartProducts.length; i++) {
            const product = cartProducts[i];
            product.Stock -= 1; // Reduce the product stock
            await product.save();
            const cartProduct = {
                productId: product._id,
                quantity: 1, // Default quantity is 1
                productDetails: product,
                Mrp: product.Mrp, // Include MRP
                Discount: product.Discount, // Include discount
                B2Bprice: product.B2Bprice
            };
            updatedProducts.push(cartProduct);
            totalPrice += 1 * product.B2Bprice;
        }
        cartObj.TotalPrice = totalPrice;
      
        let cart = await Cart.findOne({ retailerId: req.currentUser.id});
        if (!cart) {
            cart = new Cart({ retailerId: req.currentUser.id, products: [],TotalPrice:cartObj.TotalPrice});
        }
        console.log(cart);
        cart.products = updatedProducts
        await cart.save();
        res.status(201).json({ message: 'Items added to cart successfully', cart });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

cartCtlr.details = async(req, res)=>{
    try {
        const cartDetails = await Cart.find({ retailerId: req.currentUser.id })
        res.status(200).json({ cartDetails });
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

cartCtlr.delete = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ retailerId: req.currentUser.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

cartCtlr.Update = async (req, res) => {
    try {
        const productId = req.params.productId;
        const { quantity } = req.body;
        const cart = await Cart.findOne({ retailerId:req.currentUser.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const product = cart.products.find(product => product.productId.toString() === productId);
        if (!product){
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
        // await Cart.updateOne({ _id: cart._id }, { status: 'active' });
        res.status(200).json({ message: 'Product quantity updated successfully', cart });

    } catch (error) {
        console.error('Error updating product quantity:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = cartCtlr