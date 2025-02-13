const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next)=>{
  
  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) { // Check for Bearer format
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided or invalid format.'
    });
  }
  
  const token = authHeader && authHeader.split(' ')[1];

  if(!token){
    return res.status(401).json({
      success : false,
      message : 'Access denied. No token provided, please logging to continue'
    })
  }

  //decode this token
  try{
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);

    req.userInfo = decodedTokenInfo;
    next();

  }
  catch(error){
    return res.status(401).json({
      success : false,
      message : 'Failed to authenticate token. Please try again!'
    });
  }
};

module.exports = authMiddleware;