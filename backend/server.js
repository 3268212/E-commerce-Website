import path from "path";
import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import connectDB from "./config/db.js";
import { notFound,errorHandler } from "./middleware/errorMiddleware.js";
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js';

import cors from 'cors'

const port = process.env.PORT || 5000;
connectDB(); //Connect to MongoDB

const app = express();

app.use(cors())
//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cookie parser middleware
app.use(cookieParser());

const url = `https://proshop-uwql.onrender.com`;
const interval  = 30000;
function reloadWebsite(){
    axios.get(url).then((response)=>{
        console.log("website reloaded");
    })
    .catch((error)=>{
        console.log(`Error  : ${error.message}`);
    })
}

setInterval(reloadWebsite, interval);




app.use('/api/products',productRoutes);
app.use('/api/users',userRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/upload',uploadRoutes);

app.get('/api/config/paypal', (req,res) => res.send({clientId: process.env.PAYPAL_CLIENT_ID}));

const _dirname = path.resolve(); //Set _dirname to current directory
app.use('upload',express.static(path.join(_dirname,"/uploads")));

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(_dirname,'/frontend/build')));

  app.get('*',(req,res) => {
    res.sendFile(path.resolve(_dirname,'frontend','build','index.html'));
  });
} else{
  app.get('/' ,(req,res) => {
    res.send('API is running...');
  });
}



app.use(notFound);
app.use(errorHandler);


app.listen(port, () => console.log(`Server running on port ${port}`));