const Image = require('../models/images');
const {uploadToCloudinary} = require('../helpers/cloudinaryHelper');
const fs = require('fs');

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
/* const fetchImagesController = async()=>{
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
} */

module.exports = {
  uploadImageController,
  //fetchImagesController
}