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
                    throw new Errors('user email id already registered')
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
                            throw new Errors('mobile number already registered')
                        }
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

  const userCreationSchema = {
    userName : {
        notEmpty :{
            errorMessage :'userName is required' 
        },
        trim : true
    },
    companyName :{
        notEmpty : {
            errorMessage : 'company name is required'
        },
        trim : true
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
                    throw new Errors('user email id already registered')
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
            custom :{
               options :
                    async function (value){
                        const user = await User.findOne({mobileNo :value})
                        if(!user){
                            return true
                        }else{
                            throw new Errors('mobile number already registered')
                        }
                     }
                    }
         },
    role :{
            notEmpty :{
                errorMessage : 'role is requied'
            },
            isIn:{
                options : [['vendor', 'retailer']],
                errorMessage : 'role is to be in given list'
            }
        }
    }

const userUpdateSchema ={
    userName : {
        notEmpty :{
            errorMessage :'userName is required' 
        },
        trim : true
    },
    email :{
        notEmpty :{
            errorMessage :'email is required'
        },
        isEmail :{
            errorMessage :'required valid email'
        },
        trim: true,
        normalizeEmail : true
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
        }
   }
  
module.exports = {
    userRegisterSchema : userRegisterSchema,
    userLoginSchema :userLoginSchema,
    userCreationSchema : userCreationSchema,
    userUpdateSchema : userUpdateSchema

}