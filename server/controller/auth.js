const { toTitleCase, validateMobileNo } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const { sendOtp, verifyOtp } = require("../services/otpService");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  }

  async allUser(req, res) {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  }

  async sendSignupOtp(req, res) {
    let { mobileNo } = req.body;
    let error = {};
    if (!mobileNo) {
      error = {
        mobileNo: "Field must not be empty",
      };
      return res.json({ error });
    }

    if (validateMobileNo(mobileNo)) {
      console.log("sending otp");
      const otpRes = await sendOtp(mobileNo);
      console.log("otp sent");
      return res.json(otpRes);
    } else {
      error = {
        mobileNo: "Mobile No is not valid",
      };
      return res.json({ error });
    }
  }

  async verifySignupOtp(req, res) {
    let { name, mobileNo, otp } = req.body;
    let error = {};
    if (!name || !mobileNo || !otp) {
      error = {
        ...error,
        name: "Field must not be empty",
        mobileNo: "Field must not be empty",
        otp: "Field must not be empty",
      };
      return res.json({ error });
    }
    if (name.length < 3 || name.length > 25) {
      error = { ...error, name: "Name must be 3-25 character" };
      return res.json({ error });
    } else {
      if (validateMobileNo(mobileNo)) {
        name = toTitleCase(name);
        // Verify OTP
        const otpRes = await verifyOtp(mobileNo, otp);
        if (otpRes.status == "approved") {
          // If Mobile No & Number exists in Database then:
          try {
            const data = await userModel.findOne({ mobileNo: mobileNo });
            if (data) {
              error = {
                ...error,
                name: "",
                mobileNo: "Mobile No already exists",
              };
              return res.json({ error });
            } else {
              let newUser = new userModel({
                name,
                mobileNo,
                userRole: 0,
              });
              newUser
                .save()
                .then((data) => {
                  return res.json({
                    success: "Account created successfully. Please login",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          error = {
            ...error,
            name: "",
            otp: "Error in otp verification",
          };
          return res.json({ error });
        }
      } else {
        error = {
          ...error,
          name: "",
          mobileNo: "Mobile No is not valid",
        };
        return res.json({ error });
      }
    }
  }

  async sendSignInOtp(req, res) {
    const { mobileNo } = req.body;
    if (!mobileNo) {
      return res.json({
        error: "Mobile no not present",
      });
    }
    try {
      const data = await userModel.findOne({ mobileNo });
      if (!data) {
        return res.json({
          error: "Invalid Mobile No",
        });
      } else {
        const otpRes = await sendOtp(mobileNo);
        return res.json(otpRes);
      }
    } catch (err) {
      console.log(err);
      return res.send({ message: "An error occured!" });
    }
  }

  async verifySignInOtp(req, res) {
    const { mobileNo, otp } = req.body;

    if (!mobileNo || !otp) {
      return res.json({
        error: "Fields must not be empty",
      });
    }

    try {
      const user = await userModel.findOne({ mobileNo });
      if (!user) {
        return res.json({ error: "User not found!" });
      }

      const otpRes = await verifyOtp(mobileNo, otp);
      console.log(otpRes);
      if (otpRes.status == "approved") {
        const token = jwt.sign(
          { _id: user._id, role: user.userRole },
          JWT_SECRET
        );

        const encode = jwt.verify(token, JWT_SECRET);

        return res.json({
          token: token,
          user: encode,
        });
      } else {
        return res.json({
          error: "Error verifying OTP",
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        message: "Error verifying OTP",
      });
    }
  }
}

const authController = new Auth();
module.exports = authController;
