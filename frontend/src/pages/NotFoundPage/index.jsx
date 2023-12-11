import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#040404] bg-[url('/img/app_background.svg')] bg-[length:80%_80%] bg-center bg-no-repeat">
      <div className="absolute left-[-18vh] top-[-18vw] h-[30vh] w-[30vw] rounded-full bg-[#FB026A] blur-[300px]"></div>
      <div className="absolute bottom-[-20vh] right-[-20vw] h-[30vh] w-[30vw] rounded-full bg-[#FB026A] blur-[250px]"></div>
      <div className="flex h-full w-full flex-col items-center justify-center p-8">
        <h1 className="center text-6xl font-black text-white">404 Not Found</h1>
        <Link className="pt-2 text-base text-blue-100 underline" to="/">
          <span className="">&lt;</span> Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
