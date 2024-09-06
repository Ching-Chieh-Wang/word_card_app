const { body, validationResult } = require('express-validator');

// Middleware to validate label input
const validateLabelInput = [
  body('name')
    .notEmpty().withMessage('Label name is required')
    .isLength({ max: 50 }).withMessage('Label name cannot be more than 100 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {validateLabelInput};
