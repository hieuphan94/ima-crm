const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const sequelize = require('./config/database');
const seedAdmin = require('./database/seeders/adminSeed');
const basicDataSeed = require('./database/seeders/basicDataSeed');
const { connectRedis } = require('./config/redis');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3002',
    credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối Redis
connectRedis();

// Welcome route
app.get('/api', (req, res) => {
    res.json({
        message: 'IMA CRM API',
        endpoints: {
            users: '/api/users',
            tours: '/api/tours'
        }
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
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

// Sync và seed theo thứ tự
async function initializeDatabase() {
    try {
        // 1. Sync database
        await sequelize.sync({ force: true });
        console.log('Database synced');

        // 2. Run seeders
        await seedAdmin();
        await basicDataSeed();
        console.log('All seeds completed');

        // 3. Start server
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

// Chạy initialization
initializeDatabase();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    app.close(() => {
        console.log('HTTP server closed');
    });
});