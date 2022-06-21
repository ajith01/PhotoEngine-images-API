import { isLoggedIn } from '../controllers/userAccountController';
import {
  getAllCollections,
  makeNewCollection,
  getCollectionByName,
  updateCollectionObject,
  deleteCollection,
  addToCollection,
  removeFromCollection,
} from '../controllers/collectionController';

const collectionRoutes = (app) => {
  app
    .route('/collection')
    .get(isLoggedIn, getAllCollections)
    .post(isLoggedIn, makeNewCollection);

  app
    .route('/collection/:name')
    .get(isLoggedIn, getCollectionByName)
    .patch(isLoggedIn, updateCollectionObject)
    .delete(isLoggedIn, deleteCollection);

  app
    .route('/collection/:name/:imageID')
    .post(isLoggedIn, addToCollection)
    .delete(isLoggedIn, removeFromCollection);
};

export default collectionRoutes;
