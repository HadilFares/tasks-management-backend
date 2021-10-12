const mongoose =require('mongoose')
Schema =mongoose.Schema;
const status =Object.freeze({
    ToDo:'todo',
    InProgress:'inprogress',
    Done:'done',
    ToCancel:'tocancel',
});
const TaskSchema= new Schema({
   Title:{type:String},
    DateDebut:{type:Date},
    DateDebutPr:{type:Date},
    DateFin:{type:Date},
    DateFinPr:{type:Date},
    IdPersonne:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    Description:{
        type:String,
        trim:true,
        required:true

    },
    Priority:{
    low:{
        type:String
    },
    medium:{
        type:String
    },
    high:{
        type:String
    }
    },
    Statut:{
     type:String,
     enum:Object.values(status),
    },
});
Object.assign(TaskSchema.statics,{
    status,
});
const Task =mongoose.model("Task",TaskSchema);
module.exports=Task;