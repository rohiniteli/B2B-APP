const User = require('../modules/user')
const Product =require('../modules/product')
const mongoose =require('mongoose')

const cartValidation={
    products : {
        productId :{
            notEmpty: {
                errorMessage: 'productId is required'
            },
            isMongoId: {
                errorMessage: 'should be a valid mongodb id'
            }
             },
        quantity:{
            custom: {
                options: (value) => {
                    if (value <= 0) {
                        throw new Error('Quantity must be greater than 0');
                    }
                    return true;
                }
            }
        },   
   }
}

module.exports ={
    cartValidation: cartValidation
}
