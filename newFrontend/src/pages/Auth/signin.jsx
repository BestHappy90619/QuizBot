import { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { login } from "../../../redux-toolkit/reducers/auth";
import { clearMessage } from "../../../redux-toolkit/reducers/message";

import toast from "react-hot-toast";
import QBInput from "@/Components/QBInput";
import QBButton from "@/Components/QBButton";
import { HiAtSymbol, HiOutlineLockClosed } from "react-icons/hi";

import EventBus from "@/utils/EventBus";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [visibleEmailErr, setVisibleEmailErr] = useState(false);

  const [password, setPassword] = useState("");
  const [PasswordErr, setPasswordErr] = useState("");
  const [visiblePasswordErr, setVisiblePasswordErr] = useState(false);

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
    if (password.length == 0) {
      setPasswordErr("This field is required.");
      setVisiblePasswordErr(true);
      isError = true;
    } else setVisiblePasswordErr(false);

    if (isError) return;

    EventBus.dispatch("setLoading", true);

    dispatch(login({ email, password }))
      .unwrap()
      .then(() => {
        navigate("/");
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
      <div className="m-auto flex h-[450px] w-full flex-col items-center justify-between desktop:w-3/5">
        <h1 className="text-[46px] font-bold text-custom-txt-clr">Welcome</h1>
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
        <QBInput
          label="Password"
          color="purple"
          type="password"
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
        <QBButton
          className="w-full !rounded  bg-custom-btn-clr text-base font-thin normal-case "
          onClick={() => onSubmit()}
        >
          Sign In
        </QBButton>
        <p className="cursor-pointer text-custom-txt-clr" onClick={() => navigate("/resetpassword")}>Forgot password?</p>
        <div className="flex w-full items-center justify-center">
          <hr className="border-1 w-full border-t-custom-gray" />
          <p className="px-4 text-lg text-custom-gray">or</p>
          <hr className="border-1 w-full border-t-custom-gray" />
        </div>
        <QBButton className="flex w-full items-center justify-center gap-4 !rounded bg-[white] text-base font-thin normal-case">
          <Link to="/">
            <span className="text-custom-gray">Sign in with Guest</span>
          </Link>
        </QBButton>
      </div>
      <p className="absolute bottom-[40px] text-center text-base text-custom-txt-clr">
        Don't have an account?
        <Link className="ml-2 text-purple-600 underline" to="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
