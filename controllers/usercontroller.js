const { handleerror, handleresponse } = require("../middleware/autherror")
const User = require("../models/usermodel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')

//register
const register = async (req,res)=>{
    try{
        const {username, email,password} = req.body
        if(!username || !email || !password){
          return  handleresponse(res,400, false, "All fields are required")
        }
        const exisitinguser = await User.findOne({username:username})
        if(exisitinguser){
            return handleresponse(res,400, false, "username already exist")
        }
        const exisitingemail = await User.findOne({email: email})
        if(exisitingemail){
            return handleresponse(res,400, false, "email already exist")
        }
        const emailregex = /^[a-z0-9@]+gmail\.com$/
        const ismatch = emailregex.test(email)
        if(!ismatch){
            return handleresponse(res,400,false,"email formal is yoursemail@gmail.com")
        }
        const passwordregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/
        const match = passwordregex.test(password)
        if (!match) {
            return handleresponse(res,400,false,"password length is minimum 8 character maximum 12 character one special character one numeric one capital letter include")
        }
        const hashedpassword = await bcrypt.hash(password,10)
        const userdetail = new User({
           username : username,
           email : email,
          password :  hashedpassword
        })
        await userdetail.save()
        handleresponse(res,200, true, "user register succesfull" , userdetail)
    }
    catch(err){
        handleerror(res,500, false, err.message)
    }
    
}

//LOGIN
const login = async (req,res)=>{
   try{
    const {email, password} = req.body
    if(!email || !password) {
        return handleresponse(res,400,false,"All fields are required")
    }
    const exisitingrecord = await User.findOne({email:email})
    if(!exisitingrecord){
        return handleresponse(res,400,false,"email id does not exist")
    }
    const comparepassword = await bcrypt.compare(password, exisitingrecord.password)
    if(!comparepassword){
        return handleresponse(res,400,false,"Incorrect password")
    }
    console.log(exisitingrecord)
    const token = jwt.sign({
        username:exisitingrecord.username,
        email:exisitingrecord.email,
        role:exisitingrecord.role
    },process.env.TOKEN,{
        expiresIn: "2d"
    })
    res.cookie("Blogcookie", token,{
        httpOnly: true,
        secure: false,
        sameSite: "none" ,
      path: '/',
      maxAge: 2 * 24 * 60 * 60 * 1000
    })
    
    handleresponse(res,200, true, "Login succesfull" , token)
   }
   catch(err){
    handleerror(res,500, false, err.message)
    console.log(err)
}

}

//get profile
const profile = async(req,res)=>{
   try{
    const profileinfo = req.user
    if(!profileinfo){
       return handleresponse(res,400,false,"profile not found")
    }
    handleresponse(res,200,true,null,profileinfo)
   }
   catch(err){
    handleerror(res,500,false,err.message)
    console.log(err)
   }
}

//LOGOUT
const logout = async(req,res)=>{
    try{
        res.clearCookie("Blogcookie")
        handleresponse(res,200,true,"Logout succesfully")
    }
    catch(err){
        handleerror(res,500,false,err.message)
        console.log(err)
       }
}

module.exports = {
    register,
    login,
    profile,
    logout
}