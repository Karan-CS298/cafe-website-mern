import mongoose from 'mongoose';

export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');

  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (mongoose.connection.readyState === 2) {
    await mongoose.connection.asPromise();
    return mongoose.connection;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');
  return mongoose.connection;
}
