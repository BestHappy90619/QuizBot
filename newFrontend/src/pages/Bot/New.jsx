import { useState, useEffect, useRef } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ADMIN_ROLE } from "@/utils/global";

import { HiOutlineRefresh } from "react-icons/hi";
import toast from "react-hot-toast";

import QBInput from "@/Components/QBInput";
import QBTextArea from "@/Components/QBTextArea";
import QBAvatar from "@/Components/QBAvatar";
import QBButton from "@/Components/QBButton";

import BotService from "@/services/Bot";

import { ALLOWED_IMG_TYPES, isAllowedFile } from "@/utils/global";
import EventBus from "@/utils/EventBus";

const NewBot = () => {
  const navigate = useNavigate();
  const inputRef = useRef();

  const { user: currentUser } = useSelector((state) => state.auth);

  if (currentUser?.role != ADMIN_ROLE) {
    return <Navigate to="/" />;
  }

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileAvatar, setFileAvatar] = useState();
  const [srcAvatar, setSrcAvatar] = useState("/img/default_bot_img.png");

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

    BotService.create({
      bot_name: name,
      description,
      file: fileAvatar,
      created_by: currentUser.id,
    })
      .then((res) => {
        if (res.status == 200) {
          EventBus.dispatch("setLoading", false);
          toast.success(`The new bot has been successfully created.`);
          navigate("/");
        } else if (res.status == 400) {
          toast.error("Please provide the valid information!");
        } else {
          if (res.data.message == "Already Exists!")
            toast.error("The bot with same name already exists");
          else if (res.data.message == "Only .png is allowed")
            toast.error("Please upload only .png image!");
          else toast.error("Sorry, An error occurred while creating the bot.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  const onChangeAvatar = (e) => {
    showAvatar(e.target.files[0]);
    setFileAvatar(e.target.files[0]);
  };

  useEffect(() => {
    if (fileAvatar === undefined)
      fetch("/img/default_bot_img.png")
        .then((res) => res.blob())
        .then((blob) => {
          var lastModified = new Date();
          blob.lastModifiedDate = lastModified;
          blob.name = "default_bot_img.png";
          blob.lastModified = lastModified.getTime();
          setFileAvatar(
            new File([blob], "default_bot_img.png", {
              type: blob.type,
            })
          );
        });
  });

  const showAvatar = (imgFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.addEventListener("load", () => setSrcAvatar(reader.result));
  };

  return (
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
          value={name}
          className="text-custom-txt-clr"
          onChange={(e) => setName(e.target.value)}
        />
        <QBTextArea
          label="Description"
          value={description}
          className="text-custom-txt-clr"
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex justify-end gap-4">
          <QBButton className="basis-1/5 bg-custom-btn-clr" onClick={onSubmit}>
            Save
          </QBButton>
          <QBButton
            color="red"
            className="basis-1/5"
            onClick={() => navigate("/")}
          >
            Cancel
          </QBButton>
        </div>
      </div>
    </div>
  );
};

export default NewBot;
