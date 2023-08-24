import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import QBAvatar from "../Components/QBAvatar";

import { Tooltip } from "@material-tailwind/react";
import toast from "react-hot-toast";

import { IoDocumentsOutline } from "react-icons/io5";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { TbBrandWechat } from "react-icons/tb";
import { BiMessageEdit } from "react-icons/bi";

import BotService from "@/services/Bot";
import EventBus from "@/utils/EventBus";
import { ADMIN_ROLE, BASE_URL, parseURLParams } from "@/utils/global";

const BotLayout = () => {
  const navigate = useNavigate(null);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [bot, setBot] = useState({});

  var urlParams = parseURLParams(window.location.href);
  const botId = urlParams["id"][0];

  useEffect(() => {
    if (botId == undefined) return;
    EventBus.dispatch("setLoading", true);
    BotService.getBotById(botId)
      .then((res) => {
        if (res.status == 200) {
          setBot(res.data.data);
        } else if (res.status == 404) {
          toast.error("Sorry, but we can't find the selected bot.");
        } else {
          toast.error(
            "Sorry, An error occurred while getting the selected bot."
          );
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  }, [botId]);

  return (
    <>
      <div className="md:flex md:justify-between">
        <div className="flex gap-2">
          <QBAvatar src={BASE_URL + bot.img_url} radius="50%" size="70px" />
          <div className="self-center">
            <p className="text-base text-custom-txt-clr">{bot.bot_name}</p>
            <p className="w-auto text-sm text-custom-gray ">
              {bot.description}
            </p>
          </div>
        </div>
        {currentUser?.role == ADMIN_ROLE && (
          <div className="ml-2 mt-2 flex justify-center gap-2 self-center text-xl text-yellow-500 text-opacity-80 md:mt-0">
            <Tooltip
              className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
              content="Chat"
            >
              <div>
                <TbBrandWechat
                  className="cursor-pointer"
                  onClick={() => navigate("/bot/chat?id=" + botId)}
                />
              </div>
            </Tooltip>
            <Tooltip
              className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
              content="Training Data"
            >
              <div>
                <IoDocumentsOutline
                  className="cursor-pointer"
                  onClick={() => navigate("/bot/training?id=" + botId)}
                />
              </div>
            </Tooltip>
            <Tooltip
              className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
              content="Q & A"
            >
              <div>
                <AiOutlineQuestionCircle
                  className="cursor-pointer"
                  onClick={() => navigate("/bot/qa?id=" + botId)}
                />
              </div>
            </Tooltip>
            <Tooltip
              className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
              content="Edit"
            >
              <div>
                <BiMessageEdit
                  className="cursor-pointer"
                  onClick={() => navigate("/bot/edit?id=" + botId)}
                />
              </div>
            </Tooltip>
          </div>
        )}
      </div>

      <Outlet />
    </>
  );
};

export default BotLayout;
