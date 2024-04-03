const mongoose = require('mongoose')

const configureDb = async()=>{
    const url = process.env.DB_URL
    const name = process.env.DB_NAME
    try{
        const db = await mongoose.connect(`${url}/${name}`)
        console.log('connected to mongodb', db.connections[0].name)
    }
    catch(err){
        console.log(err)
    }
}

module.exports =configureDb