require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { initializeAdmin } = require('./models/admin');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const userControllerRoutes = require('./routes/userControllerRoutes');
const galleryControllerRoutes = require('./routes/galleryControllerRoutes');

const frontUrl = process.env.NEXT_PUBLIC_APP_FRONTEND_URL;

const { MONGO_URI } = require('./config/config');


const corsOptions ={
  origin:`${frontUrl}`, 
  methods:['GET','POST','PUT','DELETE'],
  credentials:true,            
  optionSuccessStatus:200,
}

const app = express();
const PORT = 5000;

app.use(cors(corsOptions));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());


app.use('/admin', adminAuthRoutes);
app.use('/user', userControllerRoutes);
app.use('/gallery', galleryControllerRoutes);


app.get('/', (req, res) => {
  res.send('Welcome to Gaibandha Student Association');
});

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await initializeAdmin(); 
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
