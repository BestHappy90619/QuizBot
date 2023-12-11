import { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ADMIN_ROLE } from "@/utils/global";

import QBInput from "@/Components/QBInput";
import QBTextArea from "@/Components/QBTextArea";
import QBAvatar from "@/Components/QBAvatar";
import QBButton from "@/Components/QBButton";

import { HiOutlineRefresh } from "react-icons/hi";
import toast from "react-hot-toast";

import BotService from "@/services/Bot";

import { BASE_URL } from "@/utils/global";
import EventBus from "@/utils/EventBus";
import { parseURLParams, isAllowedFile } from "@/utils/global";

import { ALLOWED_IMG_TYPES } from "@/utils/global";

const EditBot = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (currentUser?.role != ADMIN_ROLE) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();
  const inputRef = useRef();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [srcAvatar, setSrcAvatar] = useState("");
  const [fileAvatar, setFileAvatar] = useState();
  const [namespace, setNamespace] = useState(0);

  const urlParams = parseURLParams(window.location.href);
  const botId = urlParams["id"][0];

  useEffect(() => {
    if (botId == undefined) return;
    EventBus.dispatch("setLoading", true);
    BotService.getBotById(botId)
      .then((res) => {
        if (res.status == 200) {
          var bot = res.data.data;
          setName(bot.bot_name);
          setDescription(bot.description);
          setSrcAvatar(BASE_URL + bot.img_url);
          setNamespace(bot.namespace);
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

  const onChangeAvatar = (e) => {
    showAvatar(e.target.files[0]);
    setFileAvatar(e.target.files[0]);
  };

  const showAvatar = (imgFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.addEventListener("load", () => setSrcAvatar(reader.result));
  };

  useEffect(() => {
    if (fileAvatar === undefined && srcAvatar !== "") {
      fetch(new Request(srcAvatar), { mode: "no-cors" })
        .then((res) => res.blob())
        .then((blob) => {
          var lastModified = new Date();
          blob.lastModifiedDate = lastModified;
          blob.name = "default_bot_img.png";
          blob.lastModified = lastModified.getTime();
          var filea = new File([blob], "default_bot_img.png", {
            type: blob.type,
          });
          setFileAvatar(filea);
        });
    }
  }, [srcAvatar]);

  const onSubmit = () => {
    var isError = false;
    if (!isAllowedFile(ALLOWED_IMG_TYPES, new Array(fileAvatar))) {
      toast.error("Please upload a valid image.");
      isError = true;
    }
    if (name.length < 2 || name.length > 20) {
      toast.error("The name must be between 2 and 20 characters.");
      isError = true;
    }
    if (description.length < 2 || description.length > 160) {
      toast.error("The description must be between 2 and 160 characters.");
      isError = true;
    }

    if (isError) return;

    EventBus.dispatch("setLoading", true);

    BotService.change({
      bot_name: name,
      description,
      file: fileAvatar,
      id: botId,
      namespace,
    })
      .then((res) => {
        if (res.status == 200) {
          EventBus.dispatch("setLoading", false);
          toast.success(`The bot has been successfully updated.`);
          navigate("/");
        } else if (res.status == 400) {
          toast.error("Please provide the valid information!");
        } else {
          if (res.data.message == "Only .png is allowed")
            toast.error("Please upload only .png image!");
          else toast.error("Sorry, An error occurred while updating the bot.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        <div className="col-span-1 flex flex-col items-center gap-4">
          <QBAvatar src={srcAvatar} radius="50%" size="100%" />
          <input
            type="file"
            ref={inputRef}
            accept={[".png"]}
            className="hidden"
            onChange={(e) => onChangeAvatar(e)}
          />
          <QBButton
            className="flex items-center justify-center gap-2 rounded bg-custom-btn-clr py-3"
            onClick={() => inputRef.current.click()}
          >
            <HiOutlineRefresh className="h-4 w-4" />
            <span>Change</span>
          </QBButton>
        </div>
        <div className=" grid-rows-8 col-span-2 grid items-center gap-4 py-8">
          <QBInput
            label="Name"
            className="text-custom-txt-clr"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <QBTextArea
            label="Description"
            className="text-custom-txt-clr"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <QBButton
              className="basis-1/4 bg-custom-btn-clr"
              onClick={onSubmit}
            >
              Save Changes
            </QBButton>
            <QBButton
              color="red"
              className="basis-1/4"
              onClick={() => navigate("/bot/chat?id=" + botId)}
            >
              Cancel
            </QBButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBot;
