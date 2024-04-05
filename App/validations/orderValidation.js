const orderSchema ={
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
            },
   }
   
   module.exports = {
    orderSchema :orderSchema,
   }
