const express = require('express');
const userRoutes = require('./userRoutes');
// const tourRoutes = require('./tourRoutes');
const serviceCategoryRoutes = require('./serviceCategoryRoutes');
const dayTemplateRoutes = require('./dayTemplateRoutes');

const router = express.Router();

router.use('/users', userRoutes);
// router.use('/tours', tourRoutes);
router.use('/service-categories', serviceCategoryRoutes);
router.use('/day-templates', dayTemplateRoutes);

module.exports = router;