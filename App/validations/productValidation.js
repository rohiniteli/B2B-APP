const Product = require('../modules/product')
const User = require('../modules/user')
const Category = require('../modules/category')

const productSchema = {
    productName : {
        notEmpty :{
            errorMessage :'userName is required' 
        },
        trim : true,
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
                if(!req.file){
                    throw new Error('Image is required');
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

module.exports = {
    productSchema :productSchema
}