import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() },
    deleted_at: { type: String, default: null },
  },
  { collection: 'users' }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
export type { IUser };
