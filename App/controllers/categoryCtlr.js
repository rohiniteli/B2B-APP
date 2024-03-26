const {validationResult} = require('express-validator')
const Category = require('../modules/category')

const categoryCtlr ={}

categoryCtlr.creation =async (req,res)=>{
       const errors = validationResult(req)
       if(!errors.isEmpty()){
        return  res.status(401).json({errors : errors.array()})
       }
       try {
        const { body} = req;
        let image
        if(req.file){
            image = req.file.path;
        } 
        const newCategory =await new Category({...body ,image});
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
 
categoryCtlr.update = async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const {body} = req
        const id = req.params.id;
        let category = await Category.findByIdAndUpdate({_id:id, eployeeId:req.currentUser.id},body,{new:true} );
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
         }
        if (req.file) {
            category.image = req.file.path;
        }
        res.json({ message: 'Category updated successfully', category });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

categoryCtlr.delete=async(req, res)=>{
    try{
      const id=req.params.id
      await Category.findByIdAndDelete({_id:id, eployeeId:req.currentUser.id})
      await res.json({message:'category deleted succufully'})
    }
    catch(errors){
        console.error('Error deleting category', errors);
        res.status(500).json({message:"Internal server error"});
    }
}

categoryCtlr.allcategory = async(req, res)=>{
    try{
        const category = await Category.find().sort({createdAt :-1})
        res.json(category)
    }
    catch(error){
      res.status(400).json({errors : error.array()})
    }
}
    
module.exports= categoryCtlr