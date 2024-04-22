import mongoose from 'mongoose';

const { Schema } = mongoose;

const listSchema = new Schema({
  user_id: String,
  name: String,
  cars: Array,
}, { collection: 'lists' });

const List = mongoose.model('List', listSchema);

export default List;
