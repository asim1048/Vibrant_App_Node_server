import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser'
import schedule from 'node-schedule'

import Connection from './database/db.js';
import Route from './routes/route.js';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath function

import { sendNotificationsScheduled } from './controller/Notifications-controlller.js';

const app=express();
// app.use(cors({
//     origin: 'https://eserdhealth-4kh6m3nmjq-ue.a.run.app/',
//     credentials: true,
//   }));

app.use(cors());

function callEveryMinute() {
    console.log("One minute has passed!");
    // Add your code here that needs to be executed every minute
}

// Schedule the function to run every minute
const job = schedule.scheduleJob('0 * * * *', sendNotificationsScheduled);

// Get the directory path using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use('/',Route);

Connection();


const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>console.log(`Server is successfully running on port ${PORT}`))