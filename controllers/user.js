const nodemailer = require("nodemailer");
const { isValidObjectId } = require("mongoose");

const User = require("../models/user");
const EmailVerificationToken = require("../models/emailVerificationToken");

exports.create = async (req, res) => {
  const { name, email, password } = req.body;

  const oldUser = await User.findOne({ email });

  if (oldUser) {
    return res.status(401).json({ error: "This email already exists!" });
  }

  const newUser = new User({ name, email, password });
  await newUser.save();

  //   Generate 6 digit OTP
  let OTP = "";
  for (let i = 0; i <= 5; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  //   Save OTP in the db
  const newEmailVerificationToken = new EmailVerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await newEmailVerificationToken.save();

  //   send OTP to the new user
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "13ea683a954738",
      pass: "738ca6e7900bf6",
    },
  });

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: newUser.email,
    subject: "Email Verification",
    html: `
    <p>Your verification OTP</p>
    <h1>${OTP}</h1>
    `,
  });

  res.status(201).json({
    message: "Please verify your email. OTP has been sent to your email!",
  });
};

exports.verifyEmail = async (req, res) => {
  const { userId, OTP } = req.body;

  if (!isValidObjectId(userId)) {
    return res.status(401).json({ error: "Invalid user!" });
  }

  //   Get User
  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json({ error: "User not found!" });
  }

  //   Check if user is already verified
  if (user.isVerified) {
    return res.status(401).json({ error: "User is already verified!" });
  }

  //   Get the OTP token
  const token = await EmailVerificationToken.findOne({ owner: userId });
  if (!token) {
    return res.status(401).json({ error: "Token not found!" });
  }

  //   Check if the OTPs match
  const match = await token.compareOTPToken(OTP);
  if (!match) {
    return res.status(401).json({ error: "Please submit a valid OTP!" });
  }

  //   If they match verify the user and send an email
  user.isVerified = true;
  await user.save();

  await EmailVerificationToken.findByIdAndDelete(token._id);

  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "13ea683a954738",
      pass: "738ca6e7900bf6",
    },
  });

  transport.sendMail({
    from: "verification@reviewapp.com",
    to: user.email,
    subject: "Welcome Email",
    html: "<h1>Email Verified. Welcome to Review app.</h1>",
  });

  res.json({ message: "Your email is verified" });
};
