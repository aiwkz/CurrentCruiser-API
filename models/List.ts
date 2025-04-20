import mongoose, { Schema, Document, Model } from 'mongoose';

interface IList extends Document {
  user_id: string;
  title: string;
  cars: string[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const listSchema: Schema<IList> = new Schema(
  {
    user_id: { type: String, required: true },
    title: { type: String, required: true },
    cars: { type: [String], required: true },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() },
    deleted_at: { type: String, default: null },
  },
  { collection: 'lists' }
);

const List: Model<IList> = mongoose.model<IList>('List', listSchema);

export default List;
export type { IList };
