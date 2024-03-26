const {validationResult} = require('express-validator')
const Product = require('../modules/product')

const GRNCtlr ={}

GRNCtlr.creation = async(req, res)=>{
 const errors = validationResult(req)
 console.log(req.body)
 if(!errors.isEmpty()){
    return  res.status(401).json({errors : errors.array()})
 }
 try {
    const { VendorId, products } = req.body;
    const updatedProducts = [];
    for (let i = 0; i < products.length; i++) {
        const { productId, Stock,margin,Mrp } = products[i];
        const existingProduct = await Product.findById(productId);
        if (!existingProduct){
            throw new Error(`Product with ID ${productId} not found`);
        }
        const updatedStock = existingProduct.Stock + Stock
        const updatedMrp = existingProduct.Mrp + Mrp
        const newPurchasePrice = Math.abs(updatedMrp- updatedMrp * margin/100);
        const productStatus = existingProduct.Stock > 0 ? 'active' : 'inactive'
        existingProduct.Stock = updatedStock
        existingProduct.purchase_price = newPurchasePrice;
        existingProduct.status = productStatus;
        console.log(existingProduct)
        const updatedProduct = await existingProduct.save();
        updatedProducts.push(updatedProduct);
        }
        res.status(201).json(updatedProducts);
} catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
 }
}

module.exports = GRNCtlr