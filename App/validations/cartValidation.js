const User = require('../modules/user')
const Product =require('../modules/product')
const mongoose =require('mongoose')

const cartValidation={
    'products.*.productId': {
        notEmpty: {
            errorMessage: 'productId is required'
        },
        custom: {
            options: async function (value) {
                if (!value || !mongoose.Types.ObjectId.isValid(value)) {
                    throw new Error('Invalid productId');
                }
                return true;
            }
        }
    },
    'products.*.quantity': {
        notEmpty: {
            errorMessage: 'Quantity is required'
        },
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

module.exports ={
    cartValidation: cartValidation
}
