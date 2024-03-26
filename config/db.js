const mongoose = require('mongoose')

const configureDb = async()=>{
    try{
        const db = await mongoose.connect('mongodb://127.0.0.1:27017/B2B-APP')
        console.log('connected to mongodb')
    }
    catch(err){
        console.log(err)
    }
}

module.exports =configureDb