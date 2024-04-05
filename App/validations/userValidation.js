const User = require('../modules/user')
const axios = require('axios')

const userRegisterSchema = {
   userName : {
        notEmpty :{
            errorMessage :'userName is required' 
        }
    },
   email :{
        notEmpty :{
            errorMessage :'email is required'
        },
        isEmail :{
            errorMessage :'required valid email'
        },
        trim: true,
        normalizeEmail : true,
        custom : {
            options :
               async function(value){
                 const user = await User.findOne({email : value})
                 if(!user){
                   return true
                 }else{
                    throw new Error('user email id already registered')
                 }
                }
            }
        },
    password : {
            notEmpty :{
                errorMessage : 'password is required'
            },
            trim :true,
            isLength : {
                options :{min:8, max:128},
                errorMessage : 'password minimum should required 8 charecters and max 128 charecters'
            }
        },
    mobileNo:{
            notEmpty:{
                errorMessage : 'Mobile no is required'
            },
            trim : true,
            isMobilePhone : {
                errorMessage : ' Invalid mobile no'
            },
            isNumeric :{
                errorMessage :'mobile no should be number'
            },
            custom :{
               options :
                    async function (value){
                        const user = await User.findOne({mobileNo :value})
                        if(!user){
                            return true
                        }else{
                            throw new Error('mobile number already registered')
                        }
                  }
            }
         },
         role :{
            custom :{
                options : async function(value ,{req}){
                    if (req.body.role && req.body.role !== 'employee'&& req.body.role !=='admin') {
                        if (!value) {
                            throw new Error('role is required for vendor and retailer registrations');
                        }
                    }
                    return true;
                },
                isIn:{
                    options : [['vendor', 'retailer']],
                    errorMessage : 'role is to be in given list'
                }
            }
           },
        companyName :{
            custom :{
                options :async function (value,{req}){
                    if(req.body.role==='vendor'|| req.body.role==='retailer'){
                        if(!value){
                            throw new Error('comapany name is required for vendor and retailer roles')
                        }
                    }
                    return true
                }
            },
            trim : true
        },
        address :{
            custom:{
                options:async function(value,{req}){
                    if(req.body.role==='retailer'){
                        if(!value){
                            throw new Error('address is required for retailers')
                        }else{
                           try{
                            const response =await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(value)}&format=json&apiKey=50825159992e4c739e4288029586e826`);
                            const { features } = response.data;
                            if(features.length===0){
                                throw new Error('Invalid address');
                            }
                           }
                           catch(error){
                            throw new Error('Error verifying address');
                           } 
                        }
                    }
                    return true
                }
            }
         }
        }

 const userLoginSchema = {
    email : {
        notEmpty :{
            errorMessage: 'email is required'
        },
        isEmail : {
            errorMessage : 'required valid email'
        },
        trim : true,
        normalizeEmail : true
        },
    
    password :{
           notEmpty :{
            errorMessage : 'password is required'
           },
           trim : true,
           isLength :{
            options : {min:8, max: 128},
            errorMessage :'password should be between 8 to 128 characters'
            }
         }
  }

 module.exports = {
    userRegisterSchema : userRegisterSchema,
    userLoginSchema :userLoginSchema,
    }