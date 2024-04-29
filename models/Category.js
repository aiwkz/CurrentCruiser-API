import mongoose from 'mongoose';

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: String,
  created_at: { type: String, default: new Date().toISOString() },
  updated_at: { type: String, default: new Date().toISOString() },
  deleted_at: { type: String, default: null },
}, { collection: 'categories' });

const Category = mongoose.model('Category', categorySchema);

export default Category;
