import express from 'express';
import dotenv from 'dotenv'
import dbConnect from './config/dbConnect.js';
import router from './routes/todoRouter.js';
import cors from 'cors';
dotenv.config();
const app = express();

// Middleware for parsing JSON request bodies
app.use(express.json());
app.use(cors());
dbConnect();


//import routes 

app.use('/',router);

//connect database


//start server
const Port = process.env.PORT || 3000;
app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});