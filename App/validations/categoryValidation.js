const Category = require('../modules/category')

const categoryValidation = {
    categoryName : {
        notEmpty :{
            errorMessage : 'category name is required' 
        },
        custom :{
            options : async function(value,{req}){
                const category = await Category.findOne({categoryName:value})
                if(!category){
                    return true
                }else{
                    throw new Error('category name already exist')
                }
            }
        }
    },
    description : {
        notEmpty :{
            errorMessage: 'description is needed'  
        }    
    },
    image : {
        custom :{
            options : async function(value,{req}){
                if(!req.file){
                    throw new Error('Image is required');
                }else{
                    return true
                }
            }
        }    
    }
}


const categoryUpdate = {
    categoryName : {
        notEmpty :{
            errorMessage : 'category name is required' 
        }
         },
    description : {
        notEmpty :{
            errorMessage: 'description is needed'  
        }    
    },
    image : {
        custom :{
            options : async function(value,{req}){
                if(!req.file){
                    throw new Error('Image is required');
                }else{
                    return true
                }
            }
        }    
    }
}

module.exports = {
    categoryValidation :categoryValidation,
    categoryUpdate:categoryUpdate
}