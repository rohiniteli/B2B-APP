const {model , Schema} = require('mongoose')

const categorySchema = new Schema({
    categoryName : String,
    description : String,
    image : String
}, {timestamps:true})

const Category = model('Category', categorySchema)

module.exports = Category