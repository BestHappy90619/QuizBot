import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <iframe
        src="/img/background.html"
        className="absolute z-10 h-screen w-screen"
      />
      <div className="absolute left-[-15vh] top-[-15vw] z-0 h-[30vh] w-[30vw] rounded-full bg-[#FB026A] blur-[300px]"></div>
      <div className="absolute bottom-[-20vh] right-[-20vw] z-0 h-[25vh] w-[25vw] rounded-full bg-[#FB026A] blur-[250px]"></div>
      <div className="from-60% absolute left-[45vw] top-[40vh] z-0 h-[10vh] w-[10vw] rounded-full bg-gradient-to-tr from-[#000000] to-[#0675B3] blur-[100px]"></div>
      <div className="relative z-50 grid h-full w-full grid-cols-1 md:grid-cols-2">
        <div className="col-span-1 hidden h-full flex-col items-center justify-evenly py-24 md:flex">
          <img src="/img/logo.png" />
          <div className="flex flex-col items-center">
            <h1 className="text-custom-txt text-center text-6xl font-bold leading-[70px] tracking-wide">
              To the future,
            </h1>
            <h1 className="text-center text-6xl font-bold leading-[70px] tracking-wide text-custom-txt-clr">
              With{" "}
              <span className="bg-gradient-to-tr from-[#06DBFF] to-[#CA3DE3] bg-clip-text text-transparent">
                QuizBot
              </span>
            </h1>
          </div>
        </div>
        <div className="z-50 col-span-1 bg-opacity-5 bg-gradient-to-tl from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] backdrop-blur">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
