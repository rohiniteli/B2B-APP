const {model , Schema} = require('mongoose')

const GRNSchema =new Schema({
   products :[{
            type : Schema.Types.ObjectId,
            ref  : 'Product'
          }],
    
},{timestamps : true})

const GRN = model('GRN',GRNSchema)
module.exports = GRN