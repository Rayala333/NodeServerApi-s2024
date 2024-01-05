const express = require('express');
const mongoose = require("mongoose")
require('dotenv').config()
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors())
app.set("view engine","ejs")
// file importing
const dbCofig = require('./config/dbConfig')
//routes
const userRoutes = require('./routes/userRoute')



app.use('/api/users',userRoutes)



app.listen(process.env.PORT,()=>{
    console.log(`server run on port ${process.env.PORT}` )
})