const Product = require('../modules/product')
const Category =require('../modules/category')
const {validationResult} = require('express-validator')

productCtlr ={}
productCtlr.create = async(req, res)=>{
const errors = validationResult(req)
if(!errors.isEmpty()){
    return  res.status(401).json({errors : errors.array()})
}
try{
    const {body}= req
    let image 
    const categoryId = req.body.categoryId
    if(req.file){
        image = req.file.path
    }
    const {Mrp,Discount} =req.body
    req.body.B2Bprice = Math.abs(Mrp-Mrp*Discount/100)
    const product = new Product({...body,image:image,categoryId :categoryId, B2Bprice: req.body.B2Bprice})
    await product.save();
    res.status(201).json({ message: 'product created successfully', product: product });
}
catch(error){
    res.status(500).json({ message: 'Internal server error', error: error.message });
}
}

productCtlr.update = async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return  res.status(401).json({errors : errors.array()})
    }
    try{
        const {body} =req
        const id =req.params.id;
        let product = await Product.findByIdAndUpdate({_id:id, eployeeId:req.currentUser.id}, body, {new:true})
        if (!product) {
            return res.status(404).json({ message: 'product not found' });
         }
         if (req.file) {
            product.image = req.file.path;
        }
        res.json({ message: 'product updated successfully', product });
    }
    catch(error){
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

productCtlr.delete = async(req,res)=>{
    try{
        const id=req.params.id
        await Product.findByIdAndDelete({_id:id, eployeeId:req.currentUser.id})
         res.json({message:'product deleted succufully'})
      }
      catch(errors){
          console.error('Error deleting product', errors);
          res.status(500).json({message:"Internal server error"});
      }
  }

productCtlr.allProductsOfCategory = async(req,res)=>{
    console.log(req.params.id)
    try {
        const categoryId = req.params.categoryId
        const products = await Product.find({categoryId}).populate('categoryId').sort({ createdAt: -1 });
         if (products.length === 0) {
          return res.status(404).json({ message: "No products found for the specified category." });
        }
        res.json(products);
      } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
}

module.exports= productCtlr