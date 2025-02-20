const express = require('express');
const authMiddleWare = require('../middleware/auth-middleware');
const adminMiddleWare = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-midleware');
const {uploadImageController, fetchImagesController, deleteImageController} = require('../controllers/image-controller'); 
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

//upload theh image 
router.post('/upload', 
  authMiddleWare, 
  adminMiddleWare, 
  uploadMiddleware.single('image'), 
  uploadImageController
)

//get all the images
router.get('/get',
  authMiddleWare, 
  fetchImagesController
);

//uploadedId 67b755e824eb5976b8fee7ed,
//publishId oee7qy8u52fdiajujwqg
// _id 67b7565024eb5976b8fee7f0
//Delete iamge route
router.delete('/:id', 
  authMiddleware, 
  adminMiddleWare, 
  deleteImageController
);

module.exports = router;