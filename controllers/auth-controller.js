const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//register controller
const registerUser = async(req, res)=>{

  try{
    //extract user information from our req.body
    const {username, email, password, role} = req.body;

    //if the user is already exists in our database
    const checkExistingUser = await User.findOne({$or : [{username}, {email}]});
    if(checkExistingUser){
      return res.status(400).json({
        success : false,
        message : 'User is already exist with the same username or email, Please try with a different username or email'
      });
    }

    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save in your database
    const newlyCreatedUser  = new User({
      username,
      email,
      password : hashedPassword,
      role : role || 'user'
    })

    await newlyCreatedUser.save();

    if(newlyCreatedUser){
      res.status(201).json({
        success : true,
        message : 'User registered successfully!'
      })
    }
    else{
      res.status(400).json({
        success : false,
        message : 'Unable to rigister user, Please try again'
      })
    }

  }

  catch(e){
    console.log(e);
    res.status(500).json({
      success : false,
      message : 'Some error occured! Please try again.'
    })
    
  }
}

//login controller

const loginUser = async(req, res)=>{
  try{
    const {username, password} = req.body;

    //find if the current user exist is the database or not
    const user = await User.findOne({username});

    if(!user){
      return res.status(400).json({
        success : false,
        message : 'Invalid Credentials'
      });
    }

    //if the password is correct or not
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(!isPasswordMatch){
      return res.status(400).json({
        success : false,
        message : 'Invalid Credentials'
      })
    }
    
    //create user token
    const accessToken = jwt.sign(
      {
        userId : user._id,
        username : user.username,
        role : user.role,
      }, 
      process.env.JWT_SECRET_KEY, {
        expiresIn : '30m'
      }
    )

    res.status(200).json({
      success : true,
      message : 'Logged in successfully',
      accessToken
    })


  }
  catch(e){
    console.log(`can't login!`, e);
    res.status(500).json({
      success : false,
      message : 'Some error occured! Please try again.'
    });
  }
} 

//------------------change password
const changePassword = async(req, res)=>{
  try{
    const userId = req.userInfo.userId;

    //extract old and new password
    const {oldPassword, newPassword} = req.body;

    //find the current login user
    const user = await User.findById(userId);

    if(!user){
      return res.status(400).json({
        success : false,
        message : 'User not found'
      });
    }

    //check if the oldpassword is correct
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if(!isPasswordMatch){
      return res.status(400).json({
        success : false,
        message : 'The old password is not correct. Please try again!'
      });
    }

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);
    console.log('This is the new password',newHashedPassword);

    //update user password
    user.password = newHashedPassword;
    await user.save();

    res.status(200).json({
      success : true,
      message : 'Password changed successfully.'
    });
  }
  
  catch(error){
    console.log(`can't login!`, error);
    res.status(500).json({
      success : false,
      message : 'Incorrect password. Please try again'
    });
  }
}

module.exports = {registerUser, loginUser, changePassword};