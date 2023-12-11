import React, { useEffect, useState, useRef, useCallback } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../../redux-toolkit/reducers/auth";
import EventBus from "@/utils/EventBus";

import Sidebar from "./Sidebar";
import QBInput from "../Components/QBInput";

import {
  IconButton,
  Card,
  CardBody,
  Breadcrumbs,
} from "@material-tailwind/react";
import {
  HiOutlineSearch,
  HiOutlineLogin,
  HiChevronDoubleRight,
  HiOutlineCog,
  HiOutlineLogout,
  HiChevronDoubleLeft,
} from "react-icons/hi";

const Layout = () => {
  const currentUrl = useLocation().pathname;
  const [isSidebaropen, setIsSidebarOpen] = useState(false);
  const [searchBotInput, setSearchBotInput] = useState("");
  // const sidebarRef = useRef(null);
  // const openBtnRef = useRef(null);

  const { user: currentUser } = useSelector((state) => state.auth);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  useEffect(() => {
    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser, logOut]);

  const breadCrumbs = [
    {
      key: "/",
      text: "Bots",
      breads: [],
    },
    {
      key: "/bot/new",
      text: "New Bot",
      breads: [
        {
          text: "Bots",
          path: "/",
        },
        {
          text: "New Bot",
          path: "#",
        },
      ],
    },
    {
      key: "/bot/chat",
      text: "Chat",
      breads: [
        {
          text: "Bots",
          path: "/",
        },
        {
          text: "Chat",
          path: "#",
        },
      ],
    },
    {
      key: "/bot/training",
      text: "Training",
      breads: [
        {
          text: "Bots",
          path: "/",
        },
        {
          text: "Training",
          path: "#",
        },
      ],
    },
    {
      key: "/bot/qa",
      text: "Q & A",
      breads: [
        {
          text: "Bots",
          path: "/",
        },
        {
          text: "Q&A",
          path: "#",
        },
      ],
    },
    {
      key: "/bot/edit",
      text: "Edit",
      breads: [
        {
          text: "Bots",
          path: "/",
        },
        {
          text: "Edit",
          path: "#",
        },
      ],
    },
    // {
    //   key: "/subscription",
    //   text: "Subscription",
    //   breads: [],
    // },
    {
      key: "/contact",
      text: "Contact",
      breads: [],
    },
    {
      key: "/profile",
      text: "Profile",
      breads: [],
    },
  ];

  useEffect(() => {
    EventBus.dispatch("searchBot", searchBotInput);
  }, [searchBotInput]);

  const onToggleSidebar = () => {
    setIsSidebarOpen(!isSidebaropen);
  };

  return (
    <>
      <div className="relative h-screen w-screen overflow-hidden bg-[length:80%_80%] bg-center bg-no-repeat">
        <iframe
          src="/img/background.html"
          className="absolute z-50 h-screen w-screen"
        />
        <div className="absolute left-[-18vh] top-[-18vw] z-20 h-[30vh] w-[30vw] rounded-full bg-[#FB026A] blur-[300px]"></div>
        <div className="absolute bottom-[-20vh] right-[-20vw] z-20 h-[30vh] w-[30vw] rounded-full bg-[#FB026A] blur-[250px]"></div>
        <div
          className="relative z-50 flex h-full w-full items-center justify-between p-8"
          id="sidebar"
        >
          <div
            className={`gradient-border-solid fixed backdrop-blur ${
              !isSidebaropen ? "left-[-247px]" : "left-[6px]"
            } z-30 h-full w-[240px] overflow-auto  rounded-xl bg-[rgba(0,0,0,0.15)] transition-all md:relative md:left-0 md:backdrop-blur-0`}
          >
            <Sidebar />
          </div>
          {isSidebaropen && (
            <div className="fixed top-8 left-56 z-50">
              <IconButton
                className=" rounded bg-custom-icon-clr md:hidden"
                onClick={onToggleSidebar}
              >
                <HiChevronDoubleLeft className="text-lg text-white" />
              </IconButton>
            </div>
          )}

          <div className="gradient-border-solid-swap flex h-full w-full flex-col bg-[rgba(0,0,0,0.15)] transition-all md:w-[calc(100%-250px)]">
            <div
              className={`${
                currentUrl == "/" ? "mt-14" : ""
              } flex h-[80px] w-full flex-col-reverse items-center justify-between px-[30px] md:mt-0 md:flex md:flex-row`}
            >
              <div className="grow-0 gap-10 md:flex">
                {breadCrumbs.map((item, index) => {
                  if (item.key === currentUrl)
                    return (
                      <div key={index} className="flex gap-4">
                        {!isSidebaropen && (
                          <IconButton
                            className="rounded bg-custom-icon-clr md:hidden"
                            onClick={onToggleSidebar}
                          >
                            <HiChevronDoubleRight className="text-lg text-white" />
                          </IconButton>
                        )}
                        <h1 className="self-center text-2xl font-bold text-custom-txt-clr">
                          {item.text}
                        </h1>
                        <Breadcrumbs className=" bg-opacity-0 text-custom-gray">
                          {item.breads.map((bread, index) => {
                            if (index == item.breads.length - 1)
                              return (
                                <p key={index} className="text-custom-gray">
                                  {bread.text}
                                </p>
                              );
                            else
                              return (
                                <Link
                                  key={index}
                                  to={bread.path}
                                  className="text-custom-gray"
                                >
                                  {bread.text}
                                </Link>
                              );
                          })}
                        </Breadcrumbs>
                      </div>
                    );
                })}
                {currentUrl == "/" && (
                  <div className="mt-2 max-w-[300px] pb-2 md:mt-0">
                    <QBInput
                      icon={<HiOutlineSearch className="text-custom-gray" />}
                      label="Search for Bots"
                      labelProps={{ className: "text-black" }}
                      variant="standard"
                      className="md text-custom-txt-clr"
                      value={searchBotInput}
                      onChange={(e) => setSearchBotInput(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="relative mt-2 w-max rounded-full p-1">
                <div className="group relative">
                  <p className="cursor-pointer text-lg text-custom-txt-clr">
                    {isLoggedIn
                      ? currentUser.firstname + " " + currentUser.lastname
                      : "Guest"}
                  </p>
                  {isLoggedIn ? (
                    <Card className="absolute left-[-90px] top-[40px] z-40 w-60 origin-top-right scale-0 overflow-hidden transition-all group-hover:h-auto group-hover:scale-100 md:left-[-190px] md:top-[40px]">
                      <CardBody className="p-5 text-center">
                        <Link
                          className="flex items-center gap-4 rounded p-2 transition hover:bg-[rgba(0,213,251,1)] hover:text-white"
                          to="/profile"
                        >
                          <HiOutlineCog className="h-5 w-5" />
                          <span>Manage Account</span>
                        </Link>
                        <Link
                          className="flex items-center gap-4 rounded p-2 transition hover:bg-[rgba(0,213,251,1)] hover:text-white"
                          to="/signin"
                          onClick={logOut}
                        >
                          <HiOutlineLogout className="h-5 w-5" />
                          <span>Logout</span>
                        </Link>
                      </CardBody>
                    </Card>
                  ) : (
                    <Card className="absolute left-[-190px] top-[40px] z-40 w-60 origin-top-right scale-0 overflow-hidden transition-all group-hover:h-auto group-hover:scale-100">
                      <CardBody className="p-5 text-center">
                        <Link
                          className="flex items-center gap-4 rounded p-2 transition hover:bg-[rgba(0,213,251,1)] hover:text-white"
                          to="/signin"
                        >
                          <HiOutlineLogin className="h-5 w-5" />
                          <span>Sign In</span>
                        </Link>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-2 h-[calc(100%-80px)] overflow-y-auto p-[30px] md:mt-0">
              <Outlet />
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 z-50 w-full pr-8 text-right text-xs text-custom-txt-clr md:text-base lg:text-lg">
          &copy;2023, QuizBot Teams. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default Layout;
