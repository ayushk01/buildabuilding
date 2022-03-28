import React, { Fragment, useState, useContext } from "react";
import { loginReq, loginVerifyReq } from "./fetchApi";
import { LayoutContext } from "../index";

const Login = (props) => {
  const { data: layoutData, dispatch: layoutDispatch } =
    useContext(LayoutContext);

  const [data, setData] = useState({
    mobileNo: "",
    otp: "",
    error: false,
    loading: false,
  });
  const [otpSent, setOtpSent] = useState(false);

  const alert = (msg) => <div className="text-xs text-red-500">{msg}</div>;

  const handleSignin = async () => {
    setData({ ...data, loading: true });
    try {
      let responseData = await loginReq({
        mobileNo: data.mobileNo,
      });
      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
        });
      } else if (responseData.status) {
        alert("OTP has been sent");
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

  const handleSigninVerify = async () => {
    setData({ ...data, loading: true });
    try {
      let responseData = await loginVerifyReq({
        mobileNo: data.mobileNo,
        otp: data.otp,
      });

      if (responseData.error) {
        setData({
          ...data,
          loading: false,
          error: responseData.error,
        });
      } else if (responseData.token) {
        setData({ mobileNo: data.mobileNo, loading: false, error: false });
        localStorage.setItem("jwt", JSON.stringify(responseData));
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      setData({
        ...data,
        loading: false,
        error: "An error occured",
      });
    }
  };

  return (
    <Fragment>
      <div className="text-center text-2xl mb-6">Login</div>
      {layoutData.loginSignupError ? (
        <div className="bg-red-200 py-2 px-4 rounded">
          You need to login for checkout. Haven't accont? Create new one.
        </div>
      ) : (
        ""
      )}
      <form className="space-y-4">
        {otpSent ? (
          <div className="flex flex-col">
            <label htmlFor="name">
              Enter OTP
              <span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) => {
                setData({ ...data, otp: e.target.value, error: false });
                layoutDispatch({ type: "loginSignupError", payload: false });
              }}
              value={data.otp}
              type="number"
              id="otp"
              className={`${
                !data.error ? "" : "border-red-500"
              } px-4 py-2 focus:outline-none border`}
            />
            {!data.error ? "" : alert(data.error)}
          </div>
        ) : (
          <div className="flex flex-col">
            <label htmlFor="name">
              Mobile Number
              <span className="text-sm text-gray-600 ml-1">*</span>
            </label>
            <input
              onChange={(e) => {
                setData({ ...data, mobileNo: e.target.value, error: false });
                layoutDispatch({ type: "loginSignupError", payload: false });
              }}
              value={data.mobileNo}
              type="number"
              id="mobileNo"
              className={`${
                !data.error ? "" : "border-red-500"
              } px-4 py-2 focus:outline-none border`}
            />
            {!data.error ? "" : alert(data.error)}
          </div>
        )}

        {otpSent ? (
          <div
            onClick={(e) => handleSigninVerify()}
            style={{ background: "#303031" }}
            className="font-medium px-4 py-2 text-white text-center cursor-pointer"
          >
            {data.loading ? "loading..." : "Login"}
          </div>
        ) : (
          <div
            onClick={(e) => handleSignin()}
            style={{ background: "#303031" }}
            className="font-medium px-4 py-2 text-white text-center cursor-pointer"
          >
            {data.loading ? "loading..." : "Send OTP"}
          </div>
        )}
      </form>
    </Fragment>
  );
};

export default Login;
