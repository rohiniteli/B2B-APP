const Product = require('../modules/product')
const Category =require('../modules/category')
const {validationResult} = require('express-validator')

productCtlr ={}
productCtlr.create = async(req, res)=>{
const errors = validationResult(req)
console.log(req.files)
if(!errors.isEmpty()){
    return  res.status(401).json({errors : errors.array()})
}
try{
    let imagePaths = [];
    if (req.files && req.files.length > 0) { 
        req.files.forEach(file => {
            imagePaths.push(file.path); 
        });
    }
    const body = req.body
    const {Mrp,Discount,categoryId} =req.body 
    req.body.B2Bprice = Math.abs(Mrp-Mrp*Discount/100)
    const product = new Product({...body,image: imagePaths,categoryId :categoryId, B2Bprice: req.body.B2Bprice})
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
         let imagePaths=[]
         if (req.files) {
            product.image = req.files.forEach((file =>{
                imagePaths.push(file.path)
            }))
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
    try {
        const categoryId = req.params.Categoryid
        const products = await Product.find({categoryId}).populate('categoryId').sort({ createdAt: -1 });
         if (products.length === 0) {
          return res.status(404).json({ message: "No products found for the specified category." });
        }
        res.json(products);
      } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
}

productCtlr.softDelete = async(req, res)=>{
    const id =req.params.id
    try{
        const product = await Product.findByIdAndUpdate(id,{isDeleted:true, deletedAt: new Date()},{new:true})
        const filterProducts = {
            _id : product._id,
            productName:product.productName,
            isDeleted: product.isDeleted
        }
        console.log(JSON.stringify(filterProducts))
        res.json(filterProducts)
    }
    catch(error){
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

module.exports= productCtlr