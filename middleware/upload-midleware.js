const multer = require('multer');
const path = require('path');

//set our multer storage
const storage = multer.diskStorage({
  destination : function(req,file,cb){
    cb(null,'uploads')
  },
  filename : function(req,file,cb){
    cb(null, 
      file.filename + '-' + Date.now() + path.extname(file.originalname)
    )
  }
});

//check if is an image
const checkFileFilter = (req,file,cb)=>{
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  }
  else{
    cb(new Error('Not an image! Please upload only image.'))
  }
}

//multer middleware
module.exports = multer({
  storage : storage,
  fileFilter : checkFileFilter,
  limit :{
    fileSize : 5 *1024 *1024 //5MB file size limit
  }
});