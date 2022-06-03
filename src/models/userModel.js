import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },
  hashedPassword: {
    type: String,
    required: [true, 'Password is required'],
  },
  submitedImages: [mongoose.Schema.Types.ObjectId],
  createdDate: {
    type: Date,
    default: Date.now,
  },
  collections: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});
