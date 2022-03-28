const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { loginCheck, isAuth, isAdmin } = require("../middleware/auth");

router.post("/isadmin", authController.isAdmin);
router.post("/signup", authController.sendSignupOtp);
router.post("/verify-signup", authController.verifySignupOtp);
router.post("/signin", authController.sendSignInOtp);
router.post("/verify-signin", authController.verifySignInOtp);
router.post("/user", loginCheck, isAuth, isAdmin, authController.allUser);

module.exports = router;
