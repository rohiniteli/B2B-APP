const GRN = require('../modules/GRN')
const User = require('../modules/user')
const Product =require('../modules/product')
const mongoose =require('mongoose')

const GRNValidation={
    // VendorId :{
    //     notEmpty :{
    //         errorMessage :'vendorId is required'
    //     },
    //     trim :true,
    //     custom :{
    //         options : async function(value,{req}){
    //          try{
    //            const VendorId = await User.findOne({_id:value, role:'vendor'})
    //           if(!VendorId){
    //              throw new Error('is not a vendor')
    //              }else{
    //                return true
    //              }
    //             }
    //             catch(error){
    //            throw new Error(error.message);
    //             }
    //         }
    //     },
    // },

    products :{
        custom :{
            options : async function(value,{req}){
                const errors=[]
                console.log(req.body)
                const products = req.body && req.body[value]
                console.log(products)
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
                return errors
            }
            
        }
    },
}

module.exports ={
 GRNValidation: GRNValidation
}
