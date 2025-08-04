const mongoose=require('mongoose')
const userschema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    avatar:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }
})
// module.exports=User=mongoose.model('user',userschema)
module.exports = mongoose.model('User', userschema);
