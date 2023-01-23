const express = require("express");

const {
  create,
  verifyEmail,
  resendEmailVerificationOTP,
} = require("../controllers/user");
const { userValidation, validate } = require("../middlewares/validations");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Welcome to review app...</h1>");
});

router.post("/create", userValidation, validate, create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-otp", resendEmailVerificationOTP);

module.exports = router;
