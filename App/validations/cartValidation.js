const User = require('../modules/user')
const Product =require('../modules/product')
const mongoose =require('mongoose')

const cartValidation={
    retailerId :{
        notEmpty :{
            errorMessage :'retailer is required'
        },
        trim :true,
        custom :{
            options : async function(value,{req}){
             try{
               const retailerId = await User.findOne({_id:value, role:'retailer'})
              if(!retailerId){
                 throw new Error('is not a retailer')
                 }else{
                   return true
                 }
                }
                catch(error){
               throw new Error(error.message);
                }
            }
        },
    },

    products :{
        custom :{
            options : async function(value,{req}){
                const errors=[]
                const products = req.body[value]
                if (!products || !Array.isArray(products)) {
                     errors.push({ msg: 'Products array is required', param: value })
                }else{
                    for (let i = 0; i < products.length; i++) {
                        const product = products[i];
                        if (!product.productId || !mongoose.Types.ObjectId.isValid(product.productId)) {
                            errors.push({ msg: `Invalid productId at index ${i}`, param: `${value}[${i}].productId` })
                        }
                    } 
                }
                if (errors.length > 0) {
                    throw errors;
                }
            }
        }
    },
    quantity : {
        notEmpty :{
            errorMessage : 'quantity is required'
        },
        custom :{
            options : async function(value){
                if(value<=0){
                    throw new Error('quantity is to be greater then 0')
                }else{
                    return true
                }
            }
        }
    }
}

module.exports ={
    cartValidation: cartValidation
}
