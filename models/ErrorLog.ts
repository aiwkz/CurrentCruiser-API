import mongoose, { Document, Schema, Model } from 'mongoose';

interface IErrorLog extends Document {
  message: string;
  timestamp: string;
  route: string;
  user: string;
}

const errorLogSchema: Schema<IErrorLog> = new Schema(
  {
    message: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    route: { type: String, required: true },
    user: { type: String, required: true },
  },
  { collection: 'errorlog' }
);

const ErrorLog: Model<IErrorLog> = mongoose.model<IErrorLog>('ErrorLog', errorLogSchema);

export default ErrorLog;
export type { IErrorLog };
