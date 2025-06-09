exports.postgresErrorHandler = (err,req,res,next)=>{
    if(err.code){
       return res.status(400).send({msg:"Bad Request"} )
    }
    next(err)
}

exports.customErrorHandler= (err,req,res,next)=>{
    const {status,msg} = err
    if(err && status){
        return res.status(status).send({msg} )
    }
    next(err)
}

exports.serverErrorHandler =(err,req,res,next)=>{
    return res.status(500).send({ msg: "Internal Server Error" })

}
