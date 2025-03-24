require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-route')
const adminRoutes = require('./routes/admin-route');
const uploadImageRoute = require('./routes/image-route');

//connect to mongoDB database
connectToDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/auth',authRoutes);
app.use('/api/home',homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoute);

app.listen(PORT, ()=>{
  console.log('Server is now running on port',PORT);
});