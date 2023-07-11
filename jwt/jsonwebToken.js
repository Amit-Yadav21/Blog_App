const jwt = require('jsonwebtoken');

const createToken = ((id)=>{
    const Token = jwt.sign(id,'amit');
    return Token;
});

const verifyToken = async(req,res,next)=>{
    // console.log(req.headers);
        if(req.headers.cookie){
            let token = await req.headers.cookie.split('=')[1];
            jwt.verify(token,'amit',(err,id)=>{  // this id coming from token 

                if(err){
                    console.log(err);
                }
                else{
                    req.id__ = id 
                }
                next();
            });
            
        }else{
            // res.redirect('http://localhost:4000/login')
        }
    
}
module.exports = {verifyToken, createToken};