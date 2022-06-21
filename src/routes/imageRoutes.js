import { isLoggedIn } from '../controllers/userAccountController';
import {
  addImage,
  getAllImages,
  getImageByID,
  replaceImageByID,
  patchImageByID,
  deleteImagebyID,
} from '../controllers/imageController';
const routes = (app) => {
  app
    .route('/image')

    .get(getAllImages)

    .post(isLoggedIn, addImage);

  app
    .route('/image/:imageID')
    .get(getImageByID)

    .put(isLoggedIn, replaceImageByID)

    .patch(isLoggedIn, patchImageByID)

    .delete(isLoggedIn, deleteImagebyID);
};

export default routes;
