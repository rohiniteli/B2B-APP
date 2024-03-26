const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const User = require('../modules/user')
const bcryptjs= require('bcryptjs')
const userCtlr ={}

userCtlr.register = async(req, res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return  res.status(401).json({errors : errors.array()})
  }
  try{
  const { body} = req    
  const existingUserCount = await  User.countDocuments()
  let newUser 
  if(existingUserCount==0){
     newUser =  new User({...body, role : 'admin'})
  }
  else{
    newUser =  new User({...body,role :'employee'})
  }
  const salt = await bcryptjs.genSalt()
  const encryptedPassword =await bcryptjs.hash(newUser.password, salt)
  newUser.password =encryptedPassword
  
 await newUser.save()
    return res.status(201).json({message :'user registerd succefully ', user : newUser})
  }
  catch(error){
       res.status(500).json({error : 'internal server error'})
  }
}

userCtlr.login = async(req, res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(401).json({errors: errors.array()})
  }
  try{
  const { body } = req
  const user = await User.findOne({email : body.email})
  if(!user){
    res.status(401).json('invalid email or password')
   }
 const checkPassword = await bcryptjs.compare(body.password , user.password)
   if(!checkPassword){
    res.status(500).json('invalid email or password')
   }
   const tokenData ={
   id : user._id,
   role : user.role
   }
   const token = jwt.sign(tokenData, process.env.SEACREAT_KEY, {expiresIn : '30d'})
   res.status(201).json({token: token})
}
catch(error){
    console.log(error)
    res.status(500).json({errors : 'internal server error'})
}
}

userCtlr.creation = async(req,res)=>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  try{
     const {body} = req
     const user = new User(body)
     const salt = await bcryptjs.genSalt()
     const encryptedPassword = await bcryptjs.hash(body.password , salt)
     user.password = encryptedPassword
     await user.save()
     return res.status(201).json({message :'user registerd succefully ', user: user})
  }
  catch(error){
     res.status(500).json({error : 'internal server error'})
  }
}

userCtlr.Update = async(req, res)=>{
  const errors =validationResult(req)
  if(!errors.isEmpty()){
   return res.status(400).json({errors: errors.array()})
  }
  try{
    const {body} = req
    const id= req.params.id
    const user = await User.findByIdAndUpdate({_id:id, checkerId:req.currentUser.id}, body, {new :true})
   if (!user) {
      return res.status(404).json({ error: 'User not found or unauthorized to update' });
    }
   return res.json(user)
  }
   catch(err){
   return res.status(500).json({ errors: err.array() })
  }
}

userCtlr.delete =async(req, res)=>{
try{
const id =req.params.id
await User.findByIdAndDelete({_id:id, adminId:req.currentUser.id})
await res.json({message:'user deleted succufully'})
}
catch(error){
  console.error('Error deleting user', error);
  res.status(500).json({message:"Internal server error"});
}
};

userCtlr.profile = async (req , res) =>{
  try{
      const user = await User.findById(req.currentUser.id).select({password : 0})
      res.json(user)
  }
  catch(err){
      res.status(401).json({errors: errors.array()})
  }
}

userCtlr.allvendors = async (req, res) =>{
  try{
     const vendors =await User.find({role:'vendor'}).sort({createdAt : -1})
      res.json(vendors)
    }
  catch(error){
    res.status(400).json({errors : error.array()})
  }
}

userCtlr.companyVendors = async (req, res)=>{
  try {
    const vendors = await User.find({ role: 'vendor', companyName: company_name }).sort({ createdAt: -1 });
     if (vendors.length === 0) {
      return res.status(404).json({ message: "No vendors found for the specified company." });
    }
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

module.exports=userCtlr


