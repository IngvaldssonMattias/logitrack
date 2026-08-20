import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({
  path: ".env.test",
});

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.DATABASE_URL!);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});