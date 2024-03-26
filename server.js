require('dotenv').config()
const cors = require('cors')
const express = require('express')
const {checkSchema}=require('express-validator')
const app =express()
const configureDb = require('./config/db')
const {userRegisterSchema, userLoginSchema, userCreationSchema, userUpdateSchema} = require('./App/validations/userValidation')
const {categoryValidation, categoryUdadete} = require('./App/validations/categoryValidation')
const {productSchema} = require('./App/validations/productValidation')
const {GRNValidation} = require('./App/validations/GRNvalidation')
const {cartValidation} = require('./App/validations/cartValidation')
const {authenticateUser, authorizeUser} = require('./App/middlewares/auth')
const userCtlr = require('./App/controllers/userCtlr')
const categoryCtlr = require('./App/controllers/categoryCtlr')
const productCtlr =require('./App/controllers/productCtlr')
const GRNCtlr = require('./App/controllers/GRNCtlr')
const cartCtlr = require('./App/controllers/cartCtlr')
const upload = require('./App/middlewares/imageStorage')

app.use(express.json())
app.use('/image', express.static('./images'))
app.use(cors())
configureDb()

//user-[admin,employee]
app.post("/api/user/register",checkSchema(userRegisterSchema), userCtlr.register)
app.post("/api/user/login",checkSchema(userLoginSchema), userCtlr.login)
app.put("/api/user/employeeUpdate/:id",checkSchema(userUpdateSchema), authenticateUser,authorizeUser(['admin']), userCtlr.Update)
app.delete("/api/user/employeeDelete/:id",authenticateUser,authorizeUser(['admin']),userCtlr.delete)
app.get("/api/user/profile", authenticateUser, userCtlr.profile)

//user-[vendor, retailer]
app.post("/api/user/creation",checkSchema(userCreationSchema), authenticateUser,authorizeUser(['employee']), userCtlr.creation)
app.put("/api/user/update/:id",checkSchema(userUpdateSchema),authenticateUser,authorizeUser(['employee']), userCtlr.Update)
app.delete("/api/user/delete/:id",authenticateUser,authorizeUser(['employee']), userCtlr.delete)
app.get("/api/allVendors", authenticateUser, authorizeUser(['employee']), userCtlr.allvendors)
app.get("/api/Vendors/:companyName", authenticateUser, authorizeUser(['employee']), userCtlr.companyVendors)

//category 
app.post("/api/category/creation",upload.single('image'),checkSchema(categoryValidation), authenticateUser,authorizeUser(['employee']), categoryCtlr.creation)
app.put("/api/category/update/:id",upload.single('image'), checkSchema(categoryUdadete), authenticateUser,authorizeUser(['employee']), categoryCtlr.update)
app.delete("/api/category/delete/:id",authenticateUser,authorizeUser(['employee']), categoryCtlr.delete)
app.get("/api/categories", categoryCtlr.allcategory)

//product
app.post("/api/product/creation",upload.single('image'),checkSchema(productSchema),authenticateUser,authorizeUser(['employee']), productCtlr.create)
app.put("/api/product/update/:id",upload.single('image'),authenticateUser,authorizeUser(['employee']), productCtlr.update)
app.delete("/api/product/delete/:id",authenticateUser,authorizeUser(['employee']), productCtlr.delete)
app.get("/api/product/:CategoryId",authenticateUser,authorizeUser(['employee','retailer']), productCtlr.allProductsOfCategory)

//GRN
app.post("/api/GRN/creation",checkSchema(GRNValidation),authenticateUser,authorizeUser(['employee']),GRNCtlr.creation)
// app.put("/api/GRN/update", checkSchema(GRNValidation),authenticateUser ,authorizeUser(['employee']),GRNCtlr.update)
// app.delete("/api/GRN/delete", authenticateUser,authorizeUser(['employee']),GRNCtlr.delete )

//cart
app.post("/api/cart/add" ,checkSchema(cartValidation),authenticateUser,authorizeUser(['retailer']),cartCtlr.add)
// app.get("/api/cart/details", authenticateUser ,authorizeUser(['retailer']),cartCtlr.details )
// app.delete("/api/cartdelete/:productId",authenticateUser,authorizeUser(['retailer']),cartCtlr.delete)

//order
// app.post("/api/order/place", checkSchema(),authenticateUser,authorizeUser(['retailer']), oderCtlr.place)
// app.get("/api/order/details/:id", authenticateUser, authorizeUser(['retailer']), orderCtlr.details)
// app.get("/api/order/details", authenticateUser, authorizeUser(['employee']), orderCtlr.details)





app.listen(process.env.PORT, ()=>{
    console.log('server is running on port', process.env.PORT)
})