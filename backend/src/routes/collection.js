const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { validateCollectionInput } = require('../middlewares/validateInput/collection');
const { validatePagination } = require('../middlewares/validatePagination');
const {validateCollectionId} =require('../middlewares/validateId/collection')
const {
  create,
  getPublicById,
  getPrivateById,
  update,
  updateAuthorize,
  remove,
  getPaginatedByUserIdSortedByLastViewedAt,
  searchPublicCollections,
} = require('../controllers/collection');

// Route for searching public collections with pagination (does not require authentication)
router.get('/search', validatePagination, searchPublicCollections);

// Route to get private collection
router.get('/private/:collection_id',authorizeUser,validateCollectionId, getPrivateById);

// Route to get public collection
router.get('/public/:collection_id',validateCollectionId, getPublicById);

// Route for getting all collections of a user
router.get('/', authorizeUser, validatePagination, getPaginatedByUserIdSortedByLastViewedAt);

// Route for creating a new collection (requires authentication and input validation)
router.post('/', authorizeUser, validateCollectionInput, create);

// Route for updating a specific collection (requires authentication and ownership check)
router.put('/:collection_id', authorizeUser, validateCollectionId , validateCollectionInput, update);

// Route for updating a specific collection (requires authentication and ownership check)
router.put('/:collection_id/authorize', authorizeUser, validateCollectionId , updateAuthorize);

// Route for deleting a specific collection (requires authentication and ownership check)
router.delete('/:collection_id', authorizeUser, validateCollectionId, remove);





module.exports = router;