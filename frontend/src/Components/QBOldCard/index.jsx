import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import QBDialog from "../QBDialog";

import { Tooltip } from "@material-tailwind/react";
import { HiOutlineChat, HiOutlineTrash } from "react-icons/hi";
import toast from "react-hot-toast";

import BotService from "@/services/Bot";

import EventBus from "@/utils/EventBus";
import { ADMIN_ROLE, BASE_URL } from "@/utils/global";

const QBOldCard = (props) => {
  const navigate = useNavigate();

  const { user: currentUser } = useSelector((state) => state.auth);

  const [showDelDlg, setShowDelDlg] = useState(false);

  const { id, name, description, srcAvatar, namespace } = props;

  const handleOpen = () => setShowDelDlg(!showDelDlg);

  const onOkDelBot = () => {
    EventBus.dispatch("setLoading", true);
    setShowDelDlg(!showDelDlg);
    BotService.delBotById({ bot_id: id, namespace })
      .then((res) => {
        if (res.status == 200) {
          props.onEmptyBots();
          toast.success("The bot has been successfully deleted.");
          EventBus.dispatch("setLoading", false);
        } else if (res.status == 501) {
          toast.error(
            "Sorry, but the connection with Pinecone has been failed. Try again after a while."
          );
        } else if (res.status == 503) {
          toast.error(
            "Sorry, but deleting documents has been failed. Try again after a while."
          );
        } else {
          toast.error("Sorry, An error occurred while deleting the bot.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  const onSelectBot = () => {
    navigate("/bot/chat?id=" + id);
  };

  return (
    <div className="h-[250px] w-full md:w-[250px]">
      <div className="gradient-border-solid items-centergap-1 flex h-full w-full flex-col bg-[rgba(0,0,0,0.2)] p-2 ">
        <div className="flex w-full justify-between border-b border-b-custom-btn-clr">
          <div>
            <p className=" mt-3 text-sm text-custom-txt-clr">{name}</p>
          </div>
          <div className="my-2 flex gap-1">
            <Tooltip
              className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
              content="Chat with Bot"
            >
              <div>
                <HiOutlineChat
                  className="cursor-pointer text-xl text-custom-icon-clr"
                  onClick={onSelectBot}
                />
              </div>
            </Tooltip>
            {currentUser?.role == ADMIN_ROLE && (
              <Tooltip
                className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
                content="Delete Bot"
              >
                <div>
                  <HiOutlineTrash
                    className="cursor-pointer text-xl text-custom-icon-clr"
                    onClick={handleOpen}
                  />
                </div>
              </Tooltip>
            )}
          </div>
        </div>
        <div className="mt-3 mb-3">
          <img
            className="float-left mr-4 h-16 w-16"
            src={BASE_URL + srcAvatar}
          />
          <p className="clear-right text-custom-txt-clr">{description}</p>
        </div>
      </div>
      <QBDialog
        open={showDelDlg}
        handleOpen={handleOpen}
        onOk={onOkDelBot}
        title="You should read this!"
        notifyIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-16 w-16 text-red-500"
          >
            <path
              fillRule="evenodd"
              d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
              clipRule="evenodd"
            />
          </svg>
        }
        notifySubject="Are you sure?"
        notifyContent="Once you delete this bot, all the training data and Q & A related to this will be deleted together."
      />
    </div>
  );
};

export default QBOldCard;
