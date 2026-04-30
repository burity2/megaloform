import mongoose from 'mongoose';

async function main() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1/ps2027';
  await mongoose.connect(uri);
  console.log("✅ Mongoose is loose!")
}

export default main;
