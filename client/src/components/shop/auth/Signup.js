import React, { Fragment, useState } from "react";
import { signupReq, signupVerifyReq } from "./fetchApi";

const Signup = (props) => {
  const [data, setData] = useState({
    name: "",
    mobileNo: "",
    otp: "",
    error: false,
    loading: false,
    success: false,
  });
  const [otpSent, setOtpSent] = useState(false);

  const alert = (msg, type) => (
    <div className={`text-sm text-${type}-500`}>{msg}</div>
  );

  const handleSignup = async () => {
    setData({ ...data, loading: true });
    try {
      let responseData = await signupReq({
        mobileNo: data.mobileNo,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
        });
      } else if (responseData.status) {
        setData({ ...data, loading: false });
        setOtpSent(true);
      }
    } catch (error) {
      console.log(error);
      setData({
        ...data,
        loading: false,
        error: { mobileNo: "An error occured" },
      });
    }
  };

  const handleSignupVerify = async () => {
    setData({ ...data, loading: true });
    try {
      let responseData = await signupVerifyReq({
        name: data.name,
        mobileNo: data.mobileNo,
        otp: data.otp,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
        });
      } else if (responseData.success) {
        setData({
          success: responseData.success,
          name: "",
          mobileNo: "",
          otp: "",
          loading: false,
          error: false,
        });
        alert("User created successfully");
      }
    } catch (error) {
      console.log(error);
      setData({
        ...data,
        loading: false,
        error: { mobileNo: "An error occured" },
      });
    }
  };

  return (
    <Fragment>
      <div className="text-center text-2xl mb-6">Register</div>
      <form className="space-y-4">
        {data.success ? alert(data.success, "green") : ""}
        {otpSent ? (
          <div className="flex flex-col">
            <label htmlFor="otp">
              OTP<span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) =>
                setData({
                  ...data,
                  success: false,
                  error: {},
                  otp: e.target.value,
                })
              }
              value={data.otp}
              type="text"
              id="otp"
              className={`${
                data.error.name ? "border-red-500" : ""
              } px-4 py-2 focus:outline-none border`}
            />
            {!data.error ? "" : alert(data.error.otp, "red")}
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              <label htmlFor="name">
                Name<span className="text-sm text-gray-600 ml-1">*</span>
              </label>
              <input
                onChange={(e) =>
                  setData({
                    ...data,
                    success: false,
                    error: {},
                    name: e.target.value,
                  })
                }
                value={data.name}
                type="text"
                id="name"
                className={`${
                  data.error.name ? "border-red-500" : ""
                } px-4 py-2 focus:outline-none border`}
              />
              {!data.error ? "" : alert(data.error.name, "red")}
            </div>
            <div className="flex flex-col">
              <label htmlFor="mobileNo">
                Mobile Number
                <span className="text-sm text-gray-600 ml-1">*</span>
              </label>
              <input
                onChange={(e) =>
                  setData({
                    ...data,
                    success: false,
                    error: {},
                    mobileNo: e.target.value,
                  })
                }
                value={data.mobileNo}
                type="number"
                id="mobileNo"
                className={`${
                  data.error.mobileNo ? "border-red-500" : ""
                } px-4 py-2 focus:outline-none border`}
              />
              {!data.error ? "" : alert(data.error.mobileNo, "red")}
            </div>
          </>
        )}

        {otpSent ? (
          <div
            onClick={(e) => handleSignupVerify()}
            style={{ background: "#303031" }}
            className="px-4 py-2 text-white text-center cursor-pointer font-medium"
          >
            {data.loading ? "loading..." : "Signup"}
          </div>
        ) : (
          <div
            onClick={(e) => handleSignup()}
            style={{ background: "#303031" }}
            className="px-4 py-2 text-white text-center cursor-pointer font-medium"
          >
            {data.loading ? "loading..." : "Send OTP"}
          </div>
        )}
      </form>
    </Fragment>
  );
};

export default Signup;
