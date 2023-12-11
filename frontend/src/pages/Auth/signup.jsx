import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import { register } from "../../../redux-toolkit/reducers/auth";
import { clearMessage } from "../../../redux-toolkit/reducers/message";
import EventBus from "@/utils/EventBus";

import QBInput from "@/Components/QBInput";
import QBButton from "@/Components/QBButton";

import { HiAtSymbol, HiOutlineUser, HiOutlineLockClosed } from "react-icons/hi";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [visibleEmailErr, setVisibleEmailErr] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [firstNameErr, setFirstNameErr] = useState("");
  const [visibleFirstNameErr, setVisibleFirstNameErr] = useState(false);

  const [lastName, setLastName] = useState("");
  const [lastNameErr, setLastNameErr] = useState("");
  const [visibleLastNameErr, setVisibleLastNameErr] = useState(false);

  const [pwd, setPwd] = useState("");
  const [pwdErr, setPwdErr] = useState("");
  const [visiblePwdErr, setVisiblePwdErr] = useState(false);

  const [confPwd, setConfPwd] = useState("");
  const [confPwdErr, setConfPwdErr] = useState("");
  const [visibleConfPwdErr, setVisibleConfPwdErr] = useState(false);

  useEffect(() => {
    if (message) toast.error(message);
    dispatch(clearMessage());
  }, [message]);

  const onSubmit = async () => {
    var isError = false;
    if (
      email.length == 0 ||
      !email.includes("@") ||
      email.endsWith("@") ||
      email.startsWith("@")
    ) {
      setEmailErr("Please enter a valid email address.");
      setVisibleEmailErr(true);
      isError = true;
    } else setVisibleEmailErr(false);
    if (firstName.length < 2) {
      setFirstNameErr(
        "The firstname must be required, and also at least 2 characters."
      );
      setVisibleFirstNameErr(true);
      isError = true;
    } else setVisibleFirstNameErr(false);
    if (lastName.length < 2) {
      setLastNameErr(
        "The lastname must be required, and also at least 2 characters."
      );
      setVisibleLastNameErr(true);
      isError = true;
    } else setVisibleLastNameErr(false);
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

    dispatch(register({ email, firstName, lastName, pwd }))
      .unwrap()
      .then(() => {
        navigate("/signin");
        EventBus.dispatch("setLoading", false);
      })
      .catch(() => {
        EventBus.dispatch("setLoading", false);
      });
  };

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center p-8">
      <div className="m-auto flex h-[500px] w-full flex-col items-center justify-between desktop:w-3/5">
        <h1 className="text-[46px] font-bold text-custom-txt-clr">Sign Up</h1>
        <p className="text-custom-gray">Let's setup you account real quick</p>
        <QBInput
          label="Email address"
          color="purple"
          size="lg"
          className="text-custom-txt-clr"
          value={email}
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
        <QBInput
          label="First name"
          color="purple"
          size="lg"
          className="text-custom-txt-clr"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          icon={<HiOutlineUser />}
        />
        <p
          className={`${
            visibleFirstNameErr ? "" : "invisible"
          } self-start text-xs text-red-500`}
        >
          {firstNameErr}
        </p>
        <QBInput
          label="Last Name"
          color="purple"
          size="lg"
          className="text-custom-txt-clr"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          icon={<HiOutlineUser />}
        />
        <p
          className={`${
            visibleLastNameErr ? "" : "invisible"
          } self-start text-xs text-red-500`}
        >
          {lastNameErr}
        </p>
        <QBInput
          type="password"
          label="Password"
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
        <QBButton
          className="w-full !rounded  bg-custom-btn-clr text-base font-thin normal-case"
          onClick={() => onSubmit()}
        >
          Sign up
        </QBButton>
      </div>
      <p className="absolute bottom-[40px] text-center text-base text-custom-txt-clr">
        Already have an account?{" "}
        <Link className="ml-2 text-purple-600 underline" to="/signin">
          Signin
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
