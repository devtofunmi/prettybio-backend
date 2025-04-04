import mongoose from "mongoose";

interface IUser extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  userImage?: string;
  name?: string;
  bio?: string;
  userLink?: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userImage: { type: String },
  name: { type: String },
  bio: { type: String },
  userLink: { type: String },
});

export default mongoose.model<IUser>("User", UserSchema);
