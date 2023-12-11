import { useState } from "react";

import { Textarea, Tooltip } from "@material-tailwind/react";

import {
  AiOutlineClear,
  AiOutlineDownload,
  AiOutlineSend,
} from "react-icons/ai";
import { MdKeyboardVoice } from "react-icons/md";
import { DEBUG_MODE } from "@/utils/global";

const QBChatInput = (props) => {
  const { isActive, gettingReply, onClickSent, onClickClear, onClickExport } =
    props;

  const [msg, setMsg] = useState("");

  const onKeyUp = (e) => {
    const keyCode = e.which || e.keyCode;
    if (keyCode === 13 && !e.shiftKey) onSendMsg();
  };

  const onSendMsg = () => {
    if (!isActive || gettingReply) return;
    onClickSent(msg.trim());
    setMsg("");
  };

  const onClickClrIcn = () => {
    if (!isActive || gettingReply) return;
    onClickClear(true);
  };

  const onClickExptIcn = () => {
    if (!isActive || gettingReply) return;
    onClickExport(true);
  };

  const onClickInptViceIcn = () => {
    if (!isActive || gettingReply) return;
    if (DEBUG_MODE) console.log("Voice_Input_Mode");
  };

  return (
    <>
      <div className="relative bottom-0 flex w-[100%] rounded-[99px] border border-gray-900/10 bg-gray-900/5 p-2">
        <div
          className={`mx-2 gap-2 self-center text-xl text-yellow-500 md:flex ${
            !isActive || gettingReply ? "text-opacity-20" : "text-opacity-80"
          }`}
        >
          <Tooltip
            className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
            content="Clear Chat"
          >
            <div>
              <AiOutlineClear
                className={`${
                  !isActive || gettingReply ? "" : "cursor-pointer"
                }`}
                onClick={() => onClickClrIcn()}
              />
            </div>
          </Tooltip>
          <Tooltip
            className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
            content="Export Chat"
          >
            <div>
              <AiOutlineDownload
                className={`${
                  !isActive || gettingReply ? "" : "cursor-pointer"
                }`}
                onClick={() => onClickExptIcn()}
              />
            </div>
          </Tooltip>
          <Tooltip
            className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
            content="Input by Voice"
          >
            <div>
              <MdKeyboardVoice
                className={`${
                  !isActive || gettingReply ? "" : "cursor-pointer"
                }`}
                onClick={onClickInptViceIcn}
              />
            </div>
          </Tooltip>
        </div>
        <textarea
          rows={2}
          placeholder="Your Message"
          className="placeholder-color min-h-full w-full !border-0 border-custom-txt-clr bg-transparent text-custom-txt-clr outline-none focus:border-0 focus:border-transparent disabled:bg-white disabled:bg-opacity-20"
          disabled={!isActive || gettingReply}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div
          className={`mx-2 self-center text-xl  text-yellow-500 ${
            !isActive || gettingReply ? "text-opacity-20" : "text-opacity-80"
          }`}
        >
          <AiOutlineSend
            className={`${
              !isActive || gettingReply ? "" : "cursor-pointer"
            } rounded-full`}
            onClick={onSendMsg}
          />
        </div>
      </div>
    </>
  );
};

export default QBChatInput;
