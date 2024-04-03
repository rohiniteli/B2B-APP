const User = require('../modules/user')

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