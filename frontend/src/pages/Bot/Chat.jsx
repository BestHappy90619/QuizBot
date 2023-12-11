import { useState, useEffect } from "react";

import BotService from "@/services/Bot";

import EventBus from "@/utils/EventBus";
import { parseURLParams } from "@/utils/global";

import QBChatBody from "@/Components/QBChat/QBChatBody";
import BotLayout from "@/Layouts/BotLayout";
import QBChatInput from "@/Components/QBChat/QBChatInput";

const ChatWithBot = () => {
  const [isActive, setIsActive] = useState(true);
  const [msg, setMsg] = useState("");
  const [clearChat, setClearChat] = useState(false);
  const [exportChat, setExportChat] = useState(false);
  const [gettingReply, setGettingReply] = useState(false);

  var urlParams = parseURLParams(window.location.href);
  const botId = urlParams["id"][0];

  useEffect(() => {
    if (botId == undefined) return;
    EventBus.dispatch("setLoading", true);
    BotService.isActive(botId)
      .then((res) => {
        if (res.status == 200) {
          setIsActive(res.data.data);
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

  const onClickSent = (msg) => setMsg(msg);

  const onClickClear = (flag) => setClearChat(flag);

  const onClickExport = (flag) => setExportChat(flag);

  const onGettingReply = (flag) => setGettingReply(flag);

  return (
    <>
      <BotLayout />
      <QBChatBody
        isActive={isActive}
        newMsg={msg}
        clearChat={clearChat}
        exportChat={exportChat}
        onClickClear={onClickClear}
        onClickExport={onClickExport}
        onGettingReply={onGettingReply}
      />
      <QBChatInput
        isActive={isActive}
        gettingReply={gettingReply}
        onClickSent={onClickSent}
        onClickClear={onClickClear}
        onClickExport={onClickExport}
      />
    </>
  );
};

export default ChatWithBot;
