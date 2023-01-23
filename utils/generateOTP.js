exports.generateOTP = (otpLength = 5) => {
  //   Generate 6 digit OTP
  let OTP = "";
  for (let i = 0; i <= otpLength; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  return OTP;
};
