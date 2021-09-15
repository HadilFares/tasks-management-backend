const mongoose =require("mongoose");
Schema =mongoose.Schema;

const userSchema=new Schema({
    
    matricule:{type:String},
    name:{type:String},
    lastname:{type:String},
    email:{
        type:String,
        required:true,
        max:255,
        min:6,
    },
    password:{
        type:String,
        required:true,
        max:1024,
        min:6
    },
    dateDemarrage:{type:Date}
});


 const User=mongoose.model("User",userSchema);
 
module.exports=User;
