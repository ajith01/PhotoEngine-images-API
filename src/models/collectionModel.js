import mongoose from 'mongoose';

export const collectionsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name is required for the collection'],
  },

  description: {
    type: String,
  },

  images: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});
