const mongoose = require("mongoose");
Schema = mongoose.Schema;
const status = Object.freeze({
  ToDo: "todo",
  InProgress: "inProgress",
  Done: "done",
});
const TaskSchema = new Schema({
  Title: { type: String },
  DateDebut: { type: Date },
  DateFin: { type: Date },

  
  Description: {
    type: String,
    trim: true,
    required: true,
  },
  Priority: {
    low: {
      type: String,
    },
    medium: {
      type: String,
    },
    high: {
      type: String,
    },
  },
  Statut: {
    type: String,
    enum: Object.values(status),
  },
  Comments:{
    id:{
      type:String,
    },
    res_date:{
      type:Date,
    },
    res_text
    :{
      type:String,
    },
    user_name:{
      type:String
    }
  }
});
Object.assign(TaskSchema.statics, {
  status,
});
const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
