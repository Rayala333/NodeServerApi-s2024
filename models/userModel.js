const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, require:true },
    password: {type :String ,required:true},
    isDoctor:{type:Boolean,default:false},
    isAdmin:{type:Boolean,default:false},
    seenNotification:{type:Array,default:[]},
    unseenNotification:{type:Array,default:[]}
},{
    timestamps:true
}
)


//hashing the password

userSchema.pre('save'|| 'update',async function(next){
        try{
            if(this.isModified('password')){
                const salt= await bcrypt.genSalt(10);
                this.password = await bcrypt.hash(this.password,salt)
                next()
            }
        }catch(err){
            next(err.message)
        }
})





module.exports = mongoose.model("users",userSchema)

 

