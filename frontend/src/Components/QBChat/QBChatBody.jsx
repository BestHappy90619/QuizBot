import { useState, useRef, useEffect } from "react";

import { Spinner } from "@material-tailwind/react";
import { toast } from "react-hot-toast";

import BotService from "@/services/Bot";

import { MSG_BY_BOT, MSG_BY_USER } from "@/utils/global";
import { parseURLParams } from "@/utils/global";
import EventBus from "@/utils/EventBus";

const QBChatBody = (props) => {
  const chatRef = useRef(null);

  const {
    isActive,
    newMsg,
    clearChat,
    exportChat,
    onClickClear,
    onClickExport,
    onGettingReply,
  } = props;

  const [messages, setMessages] = useState([]);
  const [gettingReply, setGettingReply] = useState(false);
  const [bot, setBot] = useState({});
  const [addmsg, setAddMsg] = useState(false);

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

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [addmsg]);

  useEffect(() => {
    if (!newMsg.length) return;
    var tempMsgs = messages;
    tempMsgs.push({
      type: MSG_BY_USER,
      content: newMsg,
    });
    setMessages(tempMsgs);
    setAddMsg(!addmsg);

    setGettingReply(true);
    onGettingReply(true);
    BotService.getReply({ namespace: bot.namespace, message: newMsg })
      .then((res) => {
        var reply = {};
        if (res.status == 200) {
          reply = res.data;
          reply.content = reply.text;
          delete reply.text;
          reply.type = MSG_BY_BOT;
        } else if (res.status == 501) {
          reply = {
            type: MSG_BY_BOT,
            content: "System Message: Sorry! Something went wrong!",
          };
        } else if (res.status == 400) {
          reply = {
            type: MSG_BY_BOT,
            content: "System Message: Parameters were invalid!",
          };
        } else {
          reply = {
            type: MSG_BY_BOT,
            content: "System Message: Sorry! Something went wrong!",
          };
        }
        var tempMsgs = messages;
        tempMsgs.push(reply);
        setMessages(tempMsgs);
        setAddMsg(!addmsg);
        setGettingReply(false);
        onGettingReply(false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Sorry, but there seem to be some problem on our site.");
      });
  }, [newMsg]);

  useEffect(() => {
    if (!clearChat) return;
    setMessages([]);
    onClickClear(false);
  }, [clearChat]);

  useEffect(() => {
    if (!exportChat || messages.length == 0) return;
    let exportData = "";
    messages.map((message) => {
      exportData +=
        (message.type == MSG_BY_USER ? "Me" : "Bot") +
        ':  "' +
        message.content +
        '"\n\n';
    });
    const element = document.createElement("a");
    const file = new Blob([exportData], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    let now = new Date();
    element.download =
      "Chat_With_" +
      bot.bot_name +
      "_" +
      now.getFullYear() +
      "_" +
      (now.getMonth() + 1) +
      "_" +
      now.getDate() +
      "_" +
      now.getHours() +
      "_" +
      now.getMinutes() +
      "_" +
      now.getSeconds() +
      "_" +
      now.getMilliseconds() +
      ".txt";
    document.body.appendChild(element);
    element.click();
    onClickExport(false);
  }, [exportChat]);

  return (
    <>
      <div
        className={`my-4 ${
          isActive ? "" : "hidden"
        } max-h-[calc(100vh-450px)] min-h-[calc(100vh-450px)] w-full overflow-auto p-8 md:max-h-[calc(100vh-380px)] md:min-h-[calc(100vh-380px)]`}
        ref={chatRef}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              message.type == MSG_BY_BOT
                ? " max-w-[80%] justify-start md:max-w-[55%]"
                : "justify-end"
            }`}
          >
            <div
              className={`${
                message.type == MSG_BY_BOT
                  ? "bg-[#5EB2F1] text-custom-txt-clr"
                  : " max-w-[80%] bg-[#BFCF60] text-white  md:max-w-[55%] "
              }  rounded-lg p-2`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {gettingReply && (
          <div className={`mb-2 flex justify-start`}>
            <div className={`rounded-lg bg-white bg-opacity-50 p-2 text-black`}>
              <Spinner color="cyan" />
            </div>
          </div>
        )}
      </div>
      <div
        className={` ${
          isActive ? "hidden" : ""
        } z-50 my-4 flex max-h-[calc(100vh-375px)] min-h-[calc(100vh-375px)] w-full justify-center bg-white bg-opacity-20 text-3xl text-white`}
      >
        <p className="self-center">
          This bot can't chat with you due to has no training data.
        </p>
      </div>
    </>
  );
};

export default QBChatBody;
