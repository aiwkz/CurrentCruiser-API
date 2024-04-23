import mongoose from 'mongoose';

const { Schema } = mongoose;

const listSchema = new Schema({
  user_id: String,
  title: String,
  cars: Array,
  created_at: { type: String, default: new Date().toISOString() },
  updated_at: { type: String, default: new Date().toISOString() },
  deleted_at: { type: String, default: null },
}, { collection: 'lists' });

const List = mongoose.model('List', listSchema);

export default List;
