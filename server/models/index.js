import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './user';

dotenv.config();

const models = { User };

export const connectToDb = () => mongoose.connect(process.env.DATABASE_URL,
  { useNewUrlParser: true });


export default models;
