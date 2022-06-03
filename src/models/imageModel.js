import mongoose from 'mongoose';

export const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image url is required'],
    minlength: [5, 'Image url is too short'],
  },

  size: String,

  color: String,

  category: {
    type: String,
    required: [true, 'Category must be specified'],
  },

  likes: {
    type: Number,
    required: true,
    default: 0,
    minL: [0, 'Likes must be greater than 0'],
  },

  dislikes: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Dislikes cannot be negative'],
  },

  calls: {
    type: Number,
    default: 0,
    min: [0, 'Calls cannot be negative'],
  },

  submitedBy: {
    // to be populated by backend
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  createdDate: {
    type: Date,
    required: true,
    default: Date.now,
  },

  updatedDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
