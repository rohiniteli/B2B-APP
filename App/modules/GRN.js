const {model , Schema} = require('mongoose')

const GRNSchema =new Schema({
    VendorId : {
        type : Schema.Types.ObjectId,
        ref  : 'User'
    },
    products :[{
            type : Schema.Types.ObjectId,
            ref  : 'Product'
          }],
    
},{timestamps : true})

const GRN = model('GRN',GRNSchema)
module.exports = GRN