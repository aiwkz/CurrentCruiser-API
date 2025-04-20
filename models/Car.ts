import mongoose, { Schema, Document, Model } from 'mongoose';

interface CarSpecifications {
  motor: string;
  horsepower: string;
  mph0to60: string;
  topSpeed: string;
}

interface ICar extends Document {
  name: string;
  history: string;
  description: string;
  specifications: CarSpecifications;
  category_id: string;
  available_in_market: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

const carSchema: Schema<ICar> = new Schema(
  {
    name: { type: String, required: true },
    history: { type: String, required: true },
    description: { type: String, required: true },
    specifications: {
      motor: { type: String, required: true },
      horsepower: { type: String, required: true },
      mph0to60: { type: String, required: true },
      topSpeed: { type: String, required: true },
    },
    category_id: { type: String, required: true },
    available_in_market: { type: Boolean, required: true },
    created_at: { type: String, default: () => new Date().toISOString() },
    updated_at: { type: String, default: () => new Date().toISOString() },
    deleted_at: { type: String, default: null },
  },
  { collection: 'cars' }
);

const Car: Model<ICar> = mongoose.model<ICar>('Car', carSchema);

export default Car;
export type { ICar, CarSpecifications };
