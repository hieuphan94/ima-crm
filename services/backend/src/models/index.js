const sequelize = require('../config/database');

// 1. Basic models (không phụ thuộc model khác)
const User = require('./User');
const Language = require('./Language');
const Location = require('./Location');
const ServiceType = require('./ServiceType');
const ServiceCategory = require('./ServiceCategory');
const Translation = require('./Translation');
const DayTemplate = require('./DayTemplate');

// 2. Tour và các model liên quan (phụ thuộc các model cơ bản)
const Tour = require('./Tour');
const TourDay = require('./TourDay');
const TourDayService = require('./TourDayService');

// Define models object theo thứ tự dependencies
const models = {
    // Basic models
    User,
    Language,
    Location,
    ServiceType,
    ServiceCategory,
    Translation,
    DayTemplate,
    
    // Tour related models
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