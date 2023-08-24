import { Link } from "react-router-dom";
import QBMenuItem from "@/Components/QBMenuItem";

import { AiOutlineRobot } from "react-icons/ai";
import { MdOutlineConnectWithoutContact } from "react-icons/md";
import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const currentUrl = location.pathname;

  const menuLists = [
    {
      label: "Bots",
      icon: <AiOutlineRobot />,
      href: "/",
      key: [
        "/",
        "/bot/new",
        "/bot/chat",
        "/bot/training",
        "/bot/qa",
        "/bot/edit",
      ],
    },
    // {
    //   label: "Subscription",
    //   icon: <HiOutlineLightningBolt />,
    //   href: "/subscription",
    //   key: ["/subscription"],
    // },
    {
      label: "Contact",
      icon: <MdOutlineConnectWithoutContact />,
      href: "/contact",
      key: ["/contact"],
    },
  ];

  return (
    <>
      <div className="h-full p-4">
        <div className="flex border-b border-[#3D0D46]">
          <Link className="flex h-[70px] items-center gap-4 " to="/">
            <img src="/img/logo.png" className="h-[50px]" />
            <h2 className="text-2xl font-bold text-custom-txt-clr">QuizBot</h2>
          </Link>
        </div>
        <div className="relative flex h-[calc(100%-70px)] w-full flex-col items-center justify-between py-[20px]">
          <div className="w-full">
            {menuLists.map((item, index) => {
              const { label, icon, href, key } = item;
              return (
                <QBMenuItem
                  key={index}
                  label={label}
                  icon={icon}
                  selected={key.includes(currentUrl)}
                  href={href}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
