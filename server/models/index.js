import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './user';

dotenv.config();

const connectDb = () => mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });

const models = { User };

export { connectDb };

export default models;
