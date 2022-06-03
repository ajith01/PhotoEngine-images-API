import mongoose from 'mongoose';
import { imageSchema } from '../models/imageModel';

const Images = mongoose.model('Images', ImagesSchema);

export const addImage = (req, res) => {
  const newImage = new Images(req.body);

  newImage.save((err, image) => {
    if (err) {
      res.send(err);
    }

    res.json(image);
  });
};
