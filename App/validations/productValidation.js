const Product = require('../modules/product')
const User = require('../modules/user')
const Category = require('../modules/category')

const productSchema = {
    productName : {
        notEmpty :{
            errorMessage :'product name  is required' 
        },
        trim : true,
        custom :{
            options : async function(value,{req}){
                const product = await Product.findOne({productName:value})
                if(!product){
                    return true
                }else{
                    throw new Error('product name already exist')
                }
            }
          }
         },
         
    categoryId :{
        notEmpty :{
            errorMessage :'categoryid is required'
        },
        trim :true,
        custom :{
            options : async function(value,{req}){
         const CategoryId = await Category.findOne({_id:value})
        if(!CategoryId){
          throw new Error('Category not exist')
        }else{
            return true
        }
      }
     }
    },
   Mrp:{
     notEmpty :{
        errorMessage :'Mrp is required'
     },
     custom:{
        options : async function(value){
            if(value<=0){
                throw new Error('Mrp must be greater then 0')
            }else{
                return true
            }
        }
     }
    },
    Discount :{
      notEmpty :{
        errorMessage :'discount value is required'
      },
      custom:{
        options : async function(value){
            if(value<0){
                throw new Error('discount must be greater then 0')
            }else{
                return true
            }
        }
     }
    },
    expirydays :{
        notEmpty :{
            errorMessage:'daya is required'
        }
    },
   image:{
        custom :{
            options : function(value,{req}){
                if(!req.files){
                    throw new Error('Images is required');
                }else{
                    return true
                }
            }
        } 
    },
    description :{
        notEmpty :{
            errorMessage :'description is needed'
        }
    }
}

const productUpdate = {
    productName : {
        optional: true,
        trim : true,
         },
         
    categoryId :{
        optional :true,
        trim :true,
        custom :{
            options : async function(value,{req}){
         const CategoryId = await Category.findOne({_id:value})
        if(!CategoryId){
          throw new Error('Category not exist')
        }else{
            return true
        }
      }
     }
    },
   Mrp:{
    optional : true,
     custom:{
        options : async function(value){
            if(value<=0){
                throw new Error('Mrp must be greater then 0')
            }else{
                return true
            }
        }
     }
    },
    Discount :{
      optional :true,
      custom:{
        options : async function(value){
            if(value<0){
                throw new Error('discount must be greater then 0')
            }else{
                return true
            }
        }
     }
    },
    expirydays :{
       optional :true
    },
   image:{
        optional:true
    },
    description :{
        optional :true
    }
}

module.exports = {
    productSchema :productSchema,
    productUpdate:productUpdate
}