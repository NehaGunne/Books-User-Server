const user = require('./userModel');
const jwt=require('jsonwebtoken');

const handleErrors=(err)=>{
    let errors={email:'',password:'',username:''};
    if(err.message==='! Incorrect Password'){
        errors.password='! Incorrect Password'
    }
    if(err.message==='! Incorrect Email'){
        errors.email='! Incorrect Email'
    }
    if(err.code===11000){
        errors.email='this email is already registered'
        return errors;
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path]=properties.message;
        })
    }
    return errors;
}
 function verifyAccessToken(token){
    let res=jwt.verify(token,'abcd efgh',(err,payload)=>{
        if(err){
            return false
        }
        else {
            return true
        }
    })
    return res;
}
const maxAge=24*60*60;
const createToken=(id)=>{
    return jwt.sign({id},'abcd efgh',{
        expiresIn:maxAge
    });
}
const getUsers=async function(req,res){
    try{
        const users=await user.find();
        res.json(users);
        

    }catch(err){
        res.send(err);
    }
}
const getUserName=async(req,res)=>{
    try{
        res.send('i am called')
    }catch(err){
        res.send(err)
    }
}
const createUser=async(req,res)=>{
    const newUser=new user({
        username: req.body.username,
        email:req.body.email,
        password:req.body.password

    });
    try{
        const u1=await newUser.save();
        const token=createToken(u1._id);
        res.cookie('jwt',token,{httpOnly:false,maxAge:maxAge*1000})
        res.status(201).json({user:u1._id,token:token});

    }catch(err){
        const errors=handleErrors(err);
        res.status(400).json({errors});
    }

}
const login_post=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const authUser=await user.login(email,password);
        const token=createToken(authUser._id);
        res.cookie('jwt',token,{maxAge:maxAge*1000})
        res.status(200).json({user:authUser._id,token:token})

    }
    catch(err){
        const errors=handleErrors(err)
        console.log(errors)
        res.status(400).send({errors});
    }
}
const logOut=async(req,res)=>{
    try{
        res.cookie('jwt','abcd',{httpOnly:true,maxAge:1})
        res.send('logged out')
    }catch(err){
        res.send(err);
    }
}
const deleteUser=async(req,res)=>{
    try{
        const user1=await user.findById(req.params.id)
        user1.remove();
        res.send("deleted user");

    }catch(err){
        res.send(err);
    }
}
const updatePassword=async(req,res)=>{
    try{
        const user1=await user.findById(req.params.id)
        user1.password=req.body.password;
        const u1=user1.save();
        res.send("password changed");

    }catch(err){
        res.send(err);
    }
}

module.exports={getUsers,createUser,login_post,deleteUser,logOut,
    updatePassword,getUserName,verifyAccessToken};