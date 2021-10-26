const mongoose = require("mongoose");
Schema = mongoose.Schema;
const status = Object.freeze({
  ToDo: "todo",
  InProgress: "inprogress",
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
    type: String,
  },
  Statut: {
    type: String,
    enum: Object.values(status),
  },
  Comments: [{
    id: {
      type: String,
    },
    date: {
      type: Date,
    },
    text: {
      type: String,
    },
    user_name: {
      type: String,
    },
  }],
});
Object.assign(TaskSchema.statics, {
  status,
});
const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
