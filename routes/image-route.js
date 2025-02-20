const express = require('express');
const authMiddleWare = require('../middleware/auth-middleware');
const adminMiddleWare = require('../middleware/admin-middleware');
const uploadMiddleware = require('../middleware/upload-midleware');
const {uploadImageController} = require('../controllers/image-controller'); 

const router = express.Router();

//upload theh image 
router.post('/upload', 
  authMiddleWare, 
  adminMiddleWare, 
  uploadMiddleware.single('image'), 
  uploadImageController
)

//get all the images

module.exports = router;