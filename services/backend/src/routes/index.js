const express = require('express');
const userRoutes = require('./userRoutes');
const tourRoutes = require('./tourRoutes');

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tours', tourRoutes);

module.exports = router;