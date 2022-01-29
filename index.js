const express=require('express');
const app=express();
const dotenv=require('dotenv');
const mongoose= require('mongoose');
//impport routes
const authRoute=require('./routes/auth');
const blogRoute= require('./routes/blog');
const cors = require("cors")
dotenv.config();

//connect to DB

mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser:true},
()=>console.log('connected to db!')
);
//Middlewares
app.use(cors());
app.use(express.json());

//routes Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts',blogRoute);

app.listen(process.env.PORT || 3000,()=>console.log('server is running...'));
