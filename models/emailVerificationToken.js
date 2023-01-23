const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const EmailVerificationTokenSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: 3600,
    default: Date.now(),
  },
  expiryDate: {},
});

EmailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await bcrypt.hash(this.token, 10);
  }
  next();
});

EmailVerificationTokenSchema.methods.compareOTPToken = async function (token) {
  console.log("<<<TOKEN>>>", token, this.token);
  const result = await bcrypt.compare(token, this.token);
  return result;
};

module.exports = mongoose.model(
  "EmailVerificationToken",
  EmailVerificationTokenSchema
);
