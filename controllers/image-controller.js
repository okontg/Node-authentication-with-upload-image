const Image = require('../models/images');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const fs = require('fs');
const user = require('../models/user');
const cloudinary = require('../config/cloudinary')

const uploadImageController = async(req, res)=>{
  try{

    //check idf file is missing in req object
    if(!req.file){
      return res.status(400).json({
        success : false,
        message : 'File is required. Please upload an image'
      })
    }

    //upload to cloudinary
    const {url, publicId} = await uploadToCloudinary(req.file.path);

    //store the image ul and public id alogn with the uploaded user
    const newlyUploadedImage = new  Image({
      url,
      publicId,
      uploadedBy : req.userInfo.userId
    });

    await newlyUploadedImage.save();

    //delete the file from local storage
    fs.unlinkSync(req.file.path);

    res.status(202).json({
      successs : true,
      message : 'Image uploaded successfully',
      image : newlyUploadedImage
    })

  }
  catch(error){
    console.log(error);
    res.status(500).json({
      success : false,
      message : 'Something went wrong! Please try again.'
    });
  }
};

//fetched all images
const fetchImagesController = async(req, res)=>{
  try{
    const images = await Image.find({});
    if(images){
      res.status(200).json({
        success : true,
        data : images
      });
    }

  }
  catch(error){
    console.log(error);
    res.status(500).json({
      success : false,
      message : 'Can not fetched images! Please try again.'
    });
  }
};

//----------Delete image controller
const deleteImageController = async(req, res)=>{
  try{
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(getCurrentIdOfImageToBeDeleted);

    if(!image){
      return res.status(404).json({
        success : false,
        message : 'Image not found.'
      });
    }

    //check if this image is uploaded by the current user who is trying to delete it
    if(image.uploadedBy.toString() !== userId){
      return res.status(403).json({
        success : false,
        message : 'You are not authorized to delete this image.'
      })
    }

    //delete the image first from your cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);

    //delete this image from mongodb database
    await Image.findByIdAndUpdate(getCurrentIdOfImageToBeDeleted);

    res.status(200).json({
      success : true,
      message : 'Image deleted successfully.'
    });
  }

  catch(error){
    console.log(error);
    res.status(500).json({
      success : false,
      message : 'Can not delete image! Please try again.'
    });
  }
}

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController
}