const { handleresponse, handleerror } = require("./autherror")
const jwt = require('jsonwebtoken')

const authhandler = (req,res,next)=>{
   try{
    const token = req.cookies?.Blogcookie
    if(!token){
        return handleresponse(res,400,false,"token not found")
    }
    const decoded = jwt.verify(token, process.env.TOKEN)
    if(!decoded){
        return handleresponse(res,400,false,"token not match")
    }
    req.user = decoded
    next()
   }
   catch(err){
    handleerror(res,500,false,err.message)
    console.log(err)
   }


}

module.exports = {
    authhandler
}