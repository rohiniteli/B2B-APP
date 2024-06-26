const multer =require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination :(req , file, cb)=>{
        cb(null, './images')
    },
    filename :(req,file,cb)=>{
        cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
    }
})

const upload = multer({
    storage :storage,
    limits : {
        files: 5
    }
})
 module.exports =upload