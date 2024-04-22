import mongoose from 'mongoose';

const { Schema } = mongoose;

const carSchema = new Schema({
  name: String,
  history: String,
  description: String,
  specifications: {
    Motor: String,
    Horsepower: String,
    mph0to60: String,
    topSpeed: String
  },
  category_id: String,
  available_in_market: Boolean
}, { collection: 'cars' });

const Car = mongoose.model('Car', carSchema);

export default Car;
