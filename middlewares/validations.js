const { check, validationResult } = require("express-validator");

exports.userValidation = [
  check("name").trim().not().isEmpty().withMessage("Name is required!"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid email!"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8 to 20 characters long!"),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req).array();

  if (errors.length) {
    return res.json({ error: errors[0].msg });
  }

  next();
};
