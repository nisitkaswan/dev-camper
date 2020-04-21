const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');

connectDB();

const app = express();

const logger = require('./middleware/logger');

const errorHandler = require('./middleware/error');

app.use(logger);

app.use(express.json());



const PORT = process.env.PORT || 5000;

// Route files

const bootcamps = require('./routes/bootcamps');

const courses = require('./routes/courses');

const auth = require('./routes/auth');

const users = require('./routes/users');

// set static folder
app.use(express.static(path.join(__dirname, 'public')));


// Dev logging middleware

if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

// File Upload
app.use(fileupload());

app.use(cookieParser());

// Mount Routers

app.use('/api/v1/bootcamps', bootcamps);

app.use('/api/v1/courses', courses);

app.use('/api/v1/auth', auth)

app.use('/api/v1/users',users)

app.use(errorHandler);


const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} on ${PORT}`));

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // close server and exit process
    server.close(() => process.exit(1));
});
