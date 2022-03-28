const twilio = require("twilio");

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const sendOtp = async (mobileNo) => {
  const res = await client.verify
    .services(process.env.TWILIO_SERVICE_ID)
    .verifications.create({ to: `+91${mobileNo}`, channel: "sms" });

  return res;
};

const verifyOtp = async (mobileNo, otp) => {
  const res = client.verify
    .services(process.env.TWILIO_SERVICE_ID)
    .verificationChecks.create({
      to: `+91${mobileNo}`,
      code: otp,
    });

  return res;
};

module.exports = {
  sendOtp,
  verifyOtp,
};
