const mongoose = require("mongoose")

const doctorSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    fistName:{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    phoneNumber:{
        type:String,
        require:true
    },
    webSite:{
        type: String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    specialization:{
        type:String,
        require:true
    },
    experience:{
        type:String,
        require:true
    },
    freePerCunsultation:{
        type:Number,
        require:true
    },
    timings:{
        type:Array,
        require:true
    }
},{
    timestamps:true
}

)

module.exports = mongoose.model("doctors",doctorSchema)