const mongoose=require('mongoose');
require('mongoose-type-email');
const bcrypt=require('bcrypt');
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,'! please enter a username']
    },
    email:{
        type:mongoose.SchemaTypes.Email,
        required:[true,'! please enter a email'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'! please enter a password'],
        minlength:[6,'min length should be 6 characters']
    }
})
userSchema.statics.login=async function(email,password){
    const user=await this.findOne({email})
    if(user){
       const auth= await bcrypt.compare(password,user.password);
       if(auth){
           return user
       }else{
           throw Error('! Incorrect Password')
       }

    }else{
        throw Error('! Incorrect Email')
    }
}
userSchema.pre('save',async function(next){
    const salt=await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt)
    next();
})
module.exports=mongoose.model('user',userSchema);