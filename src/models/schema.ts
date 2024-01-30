import { Schema, model } from "mongoose";
import { ICategory } from "../../types";

// Document interface
interface User {
  name: string;
  email: string;
  password: string;
}

// Schema
const schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const schema2 = new Schema<ICategory>({
  name: { type: String, required: true },
  isEditable: { type: Boolean, required: false, default: true },
  color: { id: String, name: String, code: String },
  icon: { id: String, name: String, symbol: String },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
const schema3 = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Category",
  },
  name: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
});


const User = model("User", schema);
const Category = model("Category", schema2);
const Task = model("Task", schema3);

export { User, Category ,Task};
