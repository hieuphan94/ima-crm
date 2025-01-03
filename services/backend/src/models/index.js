// models/index.js
const sequelize = require('../config/database');

// Import auth models
const User = require('./auth/User');

// Import core models
const Language = require('./core/Language');
const Location = require('./core/Location');
const Translation = require('./core/Translation');

// Import tour models
const ServiceType = require('./tour/ServiceType');
const ServiceCategory = require('./tour/ServiceCategory');
const DayTemplate = require('./tour/DayTemplate');
const Tour = require('./tour/Tour');
const TourDay = require('./tour/TourDay');
const TourDayService = require('./tour/TourDayService');

// Define models object theo thứ tự dependencies
const models = {
    // Auth
    User,

    // Core
    Language,
    Location,
    Translation,

    // Tour
    ServiceType,
    ServiceCategory,
    DayTemplate,
    Tour,
    TourDay,
    TourDayService
};

// Associate all models
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Export models và sequelize
module.exports = {
    ...models,
    sequelize
};