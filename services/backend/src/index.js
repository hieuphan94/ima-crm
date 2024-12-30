// src/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const sequelize = require('./config/database');
const seedAdmin = require('./database/seeders/adminSeed');
const { connectRedis, setCache, getCache } = require('./config/redis');


const routes = require('./routes');




const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging
app.use(compression()); // Compress responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối Redis khi khởi động
connectRedis();


// Sync all models
sequelize.sync({ force: true }) // Use { force: true } in development only
    .then(async () => {
        console.log('Database synced');
        // Seed admin user
        await seedAdmin();
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });


// Welcome route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Welcome to IMA CRM API',
        version: '1.0.0',
        docs: '/api-docs' // Future Swagger/OpenAPI docs
    });
});

// Routes
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        status: 404
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
    });
});