import mongoose from 'mongoose';
import { collectionsSchema } from './collectionModel';
export const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
  },

  hashedPassword: {
    type: String,
    required: [true, 'Password is required'],
  },

  submitedImages: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

  collections: {
    type: [collectionsSchema],
    default: [],
  },
});
