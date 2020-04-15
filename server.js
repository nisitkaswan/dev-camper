

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env' });

const connectDB = require('./config/db');

connectDB();

const app = express();

const logger = require('./middleware/logger');

app.use(logger);

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Route files

const bootcamps = require('./routes/bootcamps');

// Dev logging middleware

if (process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

// Mount Routers

app.use('/api/v1/bootcamps', bootcamps);


const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} on ${PORT}`));

// Handle unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // close server and exit process
    server.close(() => process.exit(1));
});
