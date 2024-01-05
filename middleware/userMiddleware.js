const jwt = require('jsonwebtoken');

// require('dotenv').config()
const Auth =  (req,res,next)=>{
        const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.params['token']

        console.log(token,"token")
        

        if (!token) return res.status(401).send({ auth: false, message: 'No token provided' });
        
        try {
            // Verify the token
            jwt.verify(token, process.env.JWT_SECRET,(err,decoded)=>{
                    if(err){
                        console.log(err)
                        return res.status(401).send({msg:"auth faild",success:false})
                    }else{
                        req.user=decoded.ID;
                        console.log(decoded)
                        next();
                    }
            });
        }catch (err) {
            // console.log(err.message);
            return res.status(401).send({ success: false, msg: 'Failed to authenticate token' });
        }
}

module.exports = Auth