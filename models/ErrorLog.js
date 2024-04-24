import mongoose from 'mongoose';

const { Schema } = mongoose;

const errorLogSchema = new Schema({
  message: String,
  timestamp: { type: String, default: new Date().toISOString() },
  route: String,
  user: String,
}, { collection: 'errorlog' });

const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);

export default ErrorLog;
