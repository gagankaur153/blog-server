const cookieParser = require('cookie-parser')
const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const userroute = require('./routes/userroute')
const app = express()

const port = process.env.PORT || 3000
const url = process.env.URL
//middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use('/user', userroute)

app.get('/',(req,res)=>
    res.json("server is running")
)

mongoose.connect(url)
.then(()=>{
    console.log("mongodb connected")
    app.listen(port,()=>{
        console.log(`server is running on http://localhost:${port}`)
    })
})
.catch((err)=>{
    console.log(err)
})
