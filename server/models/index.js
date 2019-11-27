import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


const client = () => mongoose
  .connect(process.env.DATABASE_URL,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      replicaSet: 'rs',
      useUnifiedTopology: true
    });

export default client;
