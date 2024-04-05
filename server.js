require('dotenv').config()
const cors = require('cors')
const express = require('express')
const {checkSchema}=require('express-validator')
const app =express()
const configureDb = require('./config/db')
app.use(express.json())
app.use('/image', express.static('./images'))
app.use(cors())
configureDb()

//validations
const {userRegisterSchema, userLoginSchema} = require('./App/validations/userValidation')
const {categoryValidation,categoryUpdate} = require('./App/validations/categoryValidation')
const {productSchema,productUpdate} = require('./App/validations/productValidation')
const {GRNValidation} = require('./App/validations/GRNvalidation')
const {cartValidation, cartUpdate} = require('./App/validations/cartValidation')
const {orderSchema} = require('./App/validations/orderValidation')

//middlewares
const {authenticateUser, authorizeUser} = require('./App/middlewares/auth')
const upload = require('./App/middlewares/imageStorage')

//controllers
const userCtlr = require('./App/controllers/userCtlr')
const categoryCtlr = require('./App/controllers/categoryCtlr')
const productCtlr =require('./App/controllers/productCtlr')
const GRNCtlr = require('./App/controllers/GRNCtlr')
const cartCtlr = require('./App/controllers/cartCtlr')
const orderCtlr = require('./App/controllers/orderCtlr')

//user
app.post("/api/user/register",checkSchema(userRegisterSchema), userCtlr.register) //need review
app.get("/api/user/verify/:token", userCtlr.verify) //need review
app.post("/api/user/login",checkSchema(userLoginSchema), userCtlr.login)
app.put("/api/user/profileUpdate/:id",checkSchema(userRegisterSchema), authenticateUser,authorizeUser(['admin','employee']), userCtlr.Update)
app.delete("/api/user/employeeDelete/:id",authenticateUser,authorizeUser(['admin','employee']),userCtlr.delete)
app.get("/api/user/profile/:id", authenticateUser, userCtlr.profile)
app.post("/api/user/creation",checkSchema(userRegisterSchema), authenticateUser,authorizeUser(['employee']), userCtlr.creation)
app.get("/api/allVendors", authenticateUser, authorizeUser(['employee']), userCtlr.allvendors)
app.get("/api/Vendors/:companyName", authenticateUser, authorizeUser(['employee']), userCtlr.companyVendors)

//category 
app.post("/api/category/creation",upload.single('image'),checkSchema(categoryValidation), authenticateUser,authorizeUser(['employee']), categoryCtlr.creation)
app.put("/api/category/update/:id",upload.single('image'),checkSchema(categoryUpdate), authenticateUser,authorizeUser(['employee']), categoryCtlr.update)
app.delete("/api/category/delete/:id",authenticateUser,authorizeUser(['employee']), categoryCtlr.delete)
app.get("/api/categories", categoryCtlr.allcategory)

//product
app.post("/api/product/creation",upload.array('image',5),checkSchema(productSchema),authenticateUser,authorizeUser(['employee']), productCtlr.create)
app.put("/api/product/update/:id",upload.array('image', 5),checkSchema(productUpdate),authenticateUser,authorizeUser(['employee']), productCtlr.update)
app.delete("/api/product/delete/:id",authenticateUser,authorizeUser(['employee']), productCtlr.delete)
app.get("/api/product/:Categoryid",authenticateUser,authorizeUser(['employee','retailer']), productCtlr.allProductsOfCategory)
app.put("/api/productSoftDelete/:id", authenticateUser,authorizeUser(['employee']),productCtlr.softDelete)

//GRN
app.post("/api/GRN/creation",checkSchema(GRNValidation),authenticateUser,authorizeUser(['employee']),GRNCtlr.creation)
// app.put("/api/GRN/update", checkSchema(GRNValidation),authenticateUser ,authorizeUser(['employee']),GRNCtlr.update)
// app.delete("/api/GRN/delete", authenticateUser,authorizeUser(['employee']),GRNCtlr.delete )

//cart
app.post("/api/cart/addToCart",checkSchema(cartValidation),authenticateUser,authorizeUser(['retailer']),cartCtlr.addToCart)
app.get("/api/cart/details", authenticateUser ,authorizeUser(['retailer']),cartCtlr.details )
app.put("/api/cartUpdate/:productId",checkSchema(cartUpdate),authenticateUser,authorizeUser(['retailer']),cartCtlr.Update)
app.delete("/api/cartdelete",authenticateUser,authorizeUser(['retailer']),cartCtlr.delete)

//order
app.post("/api/order/place", checkSchema(orderSchema),authenticateUser,authorizeUser(['retailer']), orderCtlr.place)
app.get("/api/order/details/:orderId", authenticateUser, authorizeUser(['retailer']), orderCtlr.details)
app.get("/api/order/details", authenticateUser, authorizeUser(['retailer']), orderCtlr.lists)

app.listen(process.env.PORT, ()=>{
    console.log('server is running on port', process.env.PORT)
})