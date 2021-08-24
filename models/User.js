const mongoose =require("mongoose");
Schema =mongoose.Schema;
const userSchema=new Schema({
    
    matricule:{type:String},
    name:{type:String},
    lastname:{type:String},
    dateDemarrage:{type:Date}
});

 const User=mongoose.model("User",userSchema);
module.exports=User;