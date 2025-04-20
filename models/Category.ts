import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICategory extends Document {
  name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() },
    deleted_at: { type: String, default: null },
  },
  { collection: 'categories' }
);

const Category: Model<ICategory> = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
export type { ICategory };
