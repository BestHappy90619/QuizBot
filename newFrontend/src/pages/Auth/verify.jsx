import { Link } from "react-router-dom";
import { parseURLParams } from "@/utils/global";
import { useEffect, useState } from "react";
import AuthService from "@/services/Auth";

const VerifyPage = () => {
  const [ content, setContent] = useState("");

  var urlParams = parseURLParams(window.location.href);
  const token = urlParams?.token[0];

  useEffect(() => {
    if (token === "" || token === undefined){
        setContent("Invalid token!");
        return;
    }
    AuthService.verify(token)
      .then((res) => {
        if (res.status == 200) {
            setContent("Your Email has been verified successfully!");
        } else if (res.status == 400) {
            setContent("Invalid token!");
        } else if (res.status == 408) {
            setContent("Expired token!");
        } else if (res.status == 404) {
            setContent("Token not exist!");
        } else {
          setContent("Sorry, An error occurred while verifying token.");
        }
      })
      .catch((err) => {
        setContent("Sorry, but there seem to be some problem on our site.");
      });
  }, [token])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#040404] bg-[url('/img/app_background.svg')] bg-[length:80%_80%] bg-center bg-no-repeat">
      <div className="absolute left-[-18vh] top-[-18vw] h-[30vh] w-[30vw] rounded-full bg-[#FB026A] blur-[300px]"></div>
      <div className="absolute bottom-[-20vh] right-[-20vw] h-[30vh] w-[30vw] rounded-full bg-[#FB026A] blur-[250px]"></div>
      <div className="flex h-full w-full flex-col items-center justify-center p-8">
        <h1 className="center text-6xl font-black text-white">{ content }</h1>
        <Link className="pt-2 text-base text-blue-100 underline" to="/signin">
          <span className="">&lt;</span> Go to Sign In
        </Link>
      </div>
    </div>
  );
};

export default VerifyPage;
