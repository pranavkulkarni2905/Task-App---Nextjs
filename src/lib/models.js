import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
   username: { type: String, required: true, unique: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
}, { timestamps: true });

const TaskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);


export const User = mongoose.models.User || mongoose.model("User", UserSchema);
