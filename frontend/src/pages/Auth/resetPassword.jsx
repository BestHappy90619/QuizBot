import { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import toast from "react-hot-toast";
import QBInput from "@/Components/QBInput";
import QBButton from "@/Components/QBButton";
import { HiAtSymbol, HiOutlineLockClosed } from "react-icons/hi";

import EventBus from "@/utils/EventBus";
import AuthService from "@/services/Auth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [visibleEmailErr, setVisibleEmailErr] = useState(false);

  const [password, setPassword] = useState("");
  const [PasswordErr, setPasswordErr] = useState("");
  const [visiblePasswordErr, setVisiblePasswordErr] = useState(false);

  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [visiblePwdErr, setVisiblePwdErr] = useState(false);

  const [confPwd, setConfPwd] = useState("");
  const [confPwdErr, setConfPwdErr] = useState("");
  const [visibleConfPwdErr, setVisibleConfPwdErr] = useState(false);

  const [isSubmittedEmail, setIsSubmittedEmail] = useState(false);
  const [isSuccessOTP, setIsSuccessOTP] = useState(false);

  const onSubmit = async () => {
    if(!isSubmittedEmail){
        if (
            email.length == 0 ||
            !email.includes("@") ||
            email.endsWith("@") ||
            email.startsWith("@")
        ) {
            setEmailErr("Please enter a valid email address.");
            setVisibleEmailErr(true);
            return;
        } else setVisibleEmailErr(false);

        EventBus.dispatch("setLoading", true);
        AuthService.getOTP({email})
            .then((res) => {
                if (res.status == 200) {
                    toast.success("Your email has been submitted successfully. Please check your inbox.");
                    setIsSubmittedEmail(true);
                } else if (res.status == 400) {
                    toast.error("You should provide the valid email");
                } else if (res.status == 404) {
                    toast.error("Not found the provided email! You should register the email.");
                    setTimeout(() => navigate("/signup"), 3000)
                } else {
                    toast.error("Sorry, An error occurred while submitting your email.");
                }
                EventBus.dispatch("setLoading", false);
            })
            .catch((err) => {
                toast.error("Sorry, but there seem to be some problem on our site.");
                EventBus.dispatch("setLoading", false);
            });
    } else {
        if(!isSuccessOTP){
            if (password.trim().length != 6) {
                setPasswordErr("This field must be 6 characters");
                setVisiblePasswordErr(true);
                return;
            } else setVisiblePasswordErr(false);

            EventBus.dispatch("setLoading", true);
            AuthService.submitOTP({email, otp: password})
                .then((res) => {
                    if (res.status == 200) {
                        toast.success("You can access to reset the password!");
                        setIsSuccessOTP(true);
                    } else if (res.status == 400) {
                        toast.error("You should provide the valid code");
                    } else if (res.status == 401) {
                        toast.error("Incorrect code!");
                    } else if (res.status == 404) {
                        toast.error("Not Found Code!");
                    } else if (res.status == 406) {
                        toast.error("Expired Code!");
                    } else {
                        toast.error("Sorry, An error occurred while submitting your code.");
                    }
                    EventBus.dispatch("setLoading", false);
                })
                .catch((err) => {
                    toast.error("Sorry, but there seem to be some problem on our site.");
                    EventBus.dispatch("setLoading", false);
                });
        } else {
            var isError = false;
            if (pwd.length < 6) {
                setPwdErr("This password is required, and also at least 6 characters.");
                setVisiblePwdErr(true);
                isError = true;
            } else setVisiblePwdErr(false);
            if (confPwd !== pwd) {
                setConfPwdErr("This confirm password is not equal to the above.");
                setVisibleConfPwdErr(true);
                isError = true;
            } else setVisibleConfPwdErr(false);
            
            if (isError) return;

            EventBus.dispatch("setLoading", true);
            AuthService.resetPassword({ email, pwd })
                .then((res) => {
                    if (res.status == 200) {
                        toast.success("You can sign in with new password.");
                        setTimeout(() => navigate("/signin"), 3000)
                    } else {
                        toast.error("Sorry, An error occurred while submitting your email.");
                    }
                    EventBus.dispatch("setLoading", false);
                })
                .catch((err) => {
                    toast.error("Sorry, but there seem to be some problem on our site.");
                    EventBus.dispatch("setLoading", false);
                });
        }
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-8">
      <div className="m-auto flex h-[450px] w-full flex-col items-center desktop:w-3/5">
        <h1 className="text-[46px] font-bold text-custom-txt-clr">Forgot Password</h1>
        <div className={`my-8 w-full ${isSubmittedEmail ? "hidden" : ""}`}>
            <QBInput
            label="Email address"
            color="purple"
            size="lg"
            value={email}
            className="text-custom-txt-clr"
            onChange={(e) => setEmail(e.target.value)}
            icon={<HiAtSymbol />}
            />
            <p
            className={`${
                visibleEmailErr ? "" : "invisible"
            } self-start text-xs text-red-500`}
            >
            {emailErr}
            </p>
        </div>
        <div className={`my-8 w-full ${isSubmittedEmail ? isSuccessOTP ? "hidden" : "" : "hidden"}`}>
            <QBInput
            label="Code"
            color="purple"
            size="lg"
            className="text-custom-txt-clr"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<HiOutlineLockClosed />}
            />
            <p
            className={`${
                visiblePasswordErr ? "" : "invisible"
            } self-start text-xs text-red-500`}
            >
            {PasswordErr}
            </p>
        </div>
        <div className={`my-8 w-full ${isSubmittedEmail ? isSuccessOTP ? "" : "hidden" : "hidden"}`}>
            <div className="mb-4 w-full">
                <QBInput
                type="password"
                label="New password"
                color="purple"
                size="lg"
                className="text-custom-txt-clr"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                icon={<HiOutlineLockClosed />}
                />
                <p
                className={`${
                    visiblePwdErr ? "" : "invisible"
                } self-start text-xs text-red-500`}
                >
                {pwdErr}
                </p>
            </div>
            <QBInput
            type="password"
            label="Confirm Password"
            color="purple"
            size="lg"
            className="text-custom-txt-clr"
            value={confPwd}
            onChange={(e) => setConfPwd(e.target.value)}
            icon={<HiOutlineLockClosed />}
            />
            <p
            className={`${
                visibleConfPwdErr ? "" : "invisible"
            } self-start text-xs text-red-500`}
            >
            {confPwdErr}
            </p>
        </div>
        <QBButton
          className="w-full !rounded  bg-custom-btn-clr text-base font-thin normal-case "
          onClick={() => onSubmit()}
        >
          Submit
        </QBButton>
      </div>
      <p className="absolute bottom-[40px] text-center text-base text-custom-txt-clr">
        I remember my password.
        <Link className="ml-2 text-purple-600 underline" to="/signin">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default ResetPassword;
