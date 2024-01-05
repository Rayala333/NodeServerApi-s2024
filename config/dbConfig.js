const mongoose = require("mongoose")

// const connect = mongoose.connect(process.env.MONGO_URL)

// const connection = mongoose.connection;

// connection.on('connected',()=>{
//     console.log("mongoose db is connected")
// })

// connection.error('connected',(error)=>{
//     console.log("mongoose error",error)
// })

mongoose.connect(process.env.MONGO_URL).then((res)=>{
    console.log('db-connected')
},(err)=>{
    console.log(err.message)
})

module.exports = mongoose;

