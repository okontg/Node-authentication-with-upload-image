const mongoose = require('mongoose');

const connectToDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('mongodb connceted successfully!')
  }
  catch(e){
    console.log('mongodb connection failed');
    process.exit(1);
  }
}

module.exports = connectToDB;