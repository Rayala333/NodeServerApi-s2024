const router = require("express").Router()

const userSchema = require('../models/userModel')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

router.post('/register', async (req,res) => {

    const {name,email,password} = req.body

    if(!name || !email || !password){
        return res.status(400).json({msg:"Please fill out all fields",success:false})
    }
    try {
       let exist = await userSchema.findOne({email})

       console.log(exist)

       if(exist){
        return res.status(200).json({msg:'User already exists',success:false})
       }else{
        const newUser = new userSchema({
            name, email, password
        })
            await newUser.save()

            res.status(200).send({msg:`Registration success`,success:true})

       }

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server error"});
    }
})


router.post('/login', async (req,res) => {
    const {email,password}= req.body
    if(!email || !password){
        return res.status(200).send({msg:"Please fill out all fields",success:false})
    }
    try {
        const user = await userSchema.findOne({email})
        // console.log(user.id,"id")

        if(!user){
            return  res.status(200).send({msg: 'Invalid credentials',success:false})
        }else{
           const isMatch = await bcrypt.compareSync(password,user.password)

           if(!isMatch){
            return res.status(200).send({msg:'Invalid Credentials',success:false})
           }else{
            //return jsonwebtoken
            const ID = user.id
            // console.log(ID,"ID")
            const token = jwt.sign({ID},process.env.JWT_SECRET,{expiresIn: process.env.EXPIRES_IN })
            // console.log(token)
            return res.status(200).send({msg:"Login success", success:true,token:token})
           }
        }
        

    } catch (error) {
        console.log(error);
        res.status(500).send({msg:"Error in Login", success:false,error})
    }

})

// get the middle ware

const Auth = require('../middleware/userMiddleware')

// router.get('/userData', async (req,res)=>{
//     const details = await userSchema.find()
//     res.json(details)
// })

router.get('/userdata', Auth,async (req,res)=>{
    try{
        // console.log(req.user,"user")
    const details = await userSchema.findById(req.user)
    
    details.password=undefined

    if(!details){
        return res.status(200).send({msg:"user does not exist",success:false})
    }else{
        return res.status(200).send({msg:"user found",success:true,
                                data:details})
            }

    }catch(error){
        console.log("ERROR IN GET USERDATA : ", error)
        res.status(500).send({msg:"Server Error" ,success: false})
    }
})


router.post('/forgot_password',async(req,res)=>{
    const email = req.body.email;
    try{
        const user = await userSchema.findOne({email})
        if(!user){
            return  res.status(200).send({msg: 'Invalid User',success:false})
        }
        // console.log("forgotpassword")
        // res.send({msg:user.password})
        const ID = user.id

        const token = jwt.sign({ID},process.env.JWT_SECRET,{expiresIn: process.env.EXPIRES_IN })

        const link = `http://localhost:8000/api/users/reset-password/${token}`
        
        
       
        return res.send(link)
        
    }catch(error){
        console.log(error)
        res.status(500).send({msg:"Server Error" ,success: false})
    }
    
})

router.get("/reset-password/:token",Auth,async(req,res)=>{

    // console.log(req.params['token'],"user")
    // console.log(req.user,"prasad")

        try{
            const details = await userSchema.findById(req.user)
            
            if(details){
                    res.render("index",{email:details.email})
            }
        }catch(err){
            console.log(err)
            res.status(500).send({msg:"Server Error" ,success: false})
        }
})

router.post("/reset-password/:token",Auth,async(req,res)=>{

    console.log(req.params['token'],"Post")

    const {password} = req.body
    console.log(req.user,"user@123")

        try{
            const exist = await userSchema.findById(req.user)

            console.log(exist,"exit")
            
            if(!exist){
                return res.status(200).json({msg:'User Not exists',success:false})
               }else{
                const salt= await bcrypt.genSalt(10);
                    const encriptedPassword = await bcrypt.hash(password,10)
                    console.log(encriptedPassword,"encp")

                    // console.log(exist.id,"exited_id")
                    await userSchema.updateOne(
                        {
                            _id:exist.id
                        },
                        {
                            $set:{
                                password:encriptedPassword
                            }
                        }
                    )
                    
        
                    res.status(200).send({msg:`password update success`,success:true})
        
               }
        }catch(err){
            console.log(err)
            res.status(500).send({msg:"Server in upError" ,success: false})
        }
})

module.exports = router