const handleresponse = (res, statuscode = 200, status = true, message= "success", data = null)=>{
    return res.status(statuscode).json({
        status,
        message,
        data
    })
}


const handleerror = (res, statuscode = 500, status= false, message = "Inter Server Error") =>{
    return res.status(statuscode).json({
        status,
        message
    })
}

module.exports = {
    handleresponse,handleerror
}