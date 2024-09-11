const express = require('express');
const router = express.Router();

// Import sub-routers
const wordRoutes = require('./word');
const labelRoutes = require('./label');
const userRoutes = require('./user');
const wordLabelRoutes = require('./word_label');

// Use sub-routers
router.use('/users', userRoutes);
router.use('/words', wordRoutes);
// router.use('/label', labelRoutes);
// router.use('/word_label', wordLabelRoutes);

module.exports = router;
