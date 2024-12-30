const Redis = require('redis');

// Cấu hình Redis client
const redisClient = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://redis:6379'
});

// Xử lý events
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

// Connect to Redis
const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error('Redis connection failed:', error);
    }
};

// Helper functions
const setCache = async (key, value, expireTime = 3600) => {
    try {
        await redisClient.set(key, JSON.stringify(value), {
            EX: expireTime // Thời gian hết hạn tính bằng giây
        });
        return true;
    } catch (error) {
        console.error('Redis set error:', error);
        return false;
    }
};

const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis get error:', error);
        return null;
    }
};

// Export functions
module.exports = {
    redisClient,
    connectRedis,
    setCache,
    getCache
};