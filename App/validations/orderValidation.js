
const orderSchema ={
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
    status: {
        custom: {
            options: async (value, { req }) => {
                if (!['pending', 'processing', 'shipped', 'delivered'].includes(value)) {
                    throw new Error('Invalid status');
                }
                return true;
            }
        }
    }
   }

   module.exports = {
    orderSchema :orderSchema,
   }
