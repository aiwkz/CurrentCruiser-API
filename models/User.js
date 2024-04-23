import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: String,
  created_at: { type: String, default: new Date().toISOString() },
  updated_at: { type: String, default: new Date().toISOString() },
  deleted_at: { type: String, default: null },
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

export default User;
