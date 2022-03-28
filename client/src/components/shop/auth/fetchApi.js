import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const isAuthenticate = () =>
  localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")) : false;

export const isAdmin = () =>
  localStorage.getItem("jwt")
    ? JSON.parse(localStorage.getItem("jwt")).user.role === 1
    : false;

export const loginReq = async ({ mobileNo }) => {
  try {
    let res = await axios.post(`${apiURL}/api/signin`, { mobileNo });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const loginVerifyReq = async ({ mobileNo, otp }) => {
  try {
    let res = await axios.post(`${apiURL}/api/verify-signin`, {
      mobileNo,
      otp,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const signupReq = async ({ mobileNo }) => {
  try {
    let res = await axios.post(`${apiURL}/api/signup`, { mobileNo });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const signupVerifyReq = async ({ name, mobileNo, otp }) => {
  const data = { name, mobileNo, otp };
  try {
    let res = await axios.post(`${apiURL}/api/verify-signup`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
