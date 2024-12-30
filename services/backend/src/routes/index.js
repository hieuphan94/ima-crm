const express = require('express');
const userRoutes = require('./userRoutes');
const tourRoutes = require('./tourRoutes');
const serviceCategoryRoutes = require('./serviceCategoryRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tours', tourRoutes);
router.use('/service-categories', serviceCategoryRoutes);

module.exports = router;