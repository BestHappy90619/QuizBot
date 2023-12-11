import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ADMIN_ROLE } from "@/utils/global";

import QBUpload from "@/Components/QBUpload";
import QBDialog from "@/Components/QBDialog";

import BotLayout from "@/Layouts/BotLayout";

import TrainingService from "@/services/Training";
import BotService from "@/services/Bot";
import EventBus from "@/utils/EventBus";
import {
  parseURLParams,
  isAllowedFile,
  ALLOWED_DOC_TYPES,
  BASE_URL,
} from "@/utils/global";

import { List, ListItem, Button } from "@material-tailwind/react";
import toast from "react-hot-toast";

import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineCloudSync,
} from "react-icons/ai";
import { BsFillTrash3Fill } from "react-icons/bs";

const Training = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (currentUser?.role != ADMIN_ROLE) {
    return <Navigate to="/" />;
  }

  const [selectedDocIndex, setSelectedDocIndex] = useState(-1);
  const [selectedDelIconIndex, setSelectedDelIconIndex] = useState(-1);
  const [bot, setBot] = useState({});
  const [docs, setDocs] = useState([]);
  const [reloadDocs, setReloadDocs] = useState(false);
  const [showDelDlg, setShowDelDlg] = useState(false);
  const [showClrDlg, setShowClrDlg] = useState(false);

  var urlParams = parseURLParams(window.location.href);
  const botId = urlParams["id"][0];

  useEffect(() => {
    EventBus.dispatch("setLoading", true);
    TrainingService.getAllTrainDataByBot(botId)
      .then((res) => {
        if (res.status == 200 || res.status == 404) {
          setDocs(res.data.data);
        } else if (res.status != 404) {
          toast.error("Sorry, An error occurred while getting the documents.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  }, [reloadDocs]);

  useEffect(() => {
    if (botId == undefined) return;
    EventBus.dispatch("setLoading", true);
    BotService.getBotById(botId)
      .then((res) => {
        if (res.status == 200) {
          setBot(res.data.data);
          setReloadDocs(!reloadDocs);
          setSelectedDocIndex(-1);
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

  const onUploadData = (files) => {
    if (!files.length) {
      toast.error("Please upload a document.");
      return;
    } else if (!isAllowedFile(ALLOWED_DOC_TYPES, files)) {
      toast.error("Please upload a valid document.");
      return;
    }

    EventBus.dispatch("setLoading", true);

    TrainingService.uploadData({
      file: files[0],
      namespace: bot.namespace,
      bot_id: botId,
      user_id: currentUser?.id,
    })
      .then((res) => {
        if (res.status == 200) {
          setReloadDocs(!reloadDocs);
          setSelectedDocIndex(-1);
        } else if (res.status == 501) {
          setReloadDocs(!reloadDocs);
          setSelectedDocIndex(-1);
          toast.error(
            "Sorry, the training has been failed. Please retrain after a while."
          );
        } else {
          if (res.data.message == "Not Allowed file")
            toast.error("Please upload a valid document.");
          else
            toast.error(
              "Sorry, An error occurred while uploading the document."
            );
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  const onClickDelIcon = () => setShowDelDlg(!showDelDlg);

  const onOkDelDoc = () => {
    EventBus.dispatch("setLoading", true);
    setShowDelDlg(!showDelDlg);
    const selectedDoc = docs[selectedDelIconIndex];

    TrainingService.delTrainDataById({
      delTrainDataId: selectedDoc.id,
      delTrainDataFilename: selectedDoc.filename,
      delTrainDataIsTrained: selectedDoc.is_trained,
      namespace: bot.namespace,
      bot_id: bot.id,
    })
      .then((res) => {
        if (res.status == 200) {
          setReloadDocs(!reloadDocs);
          toast.success("The selected document has been successfully deleted.");
        } else if (res.status == 501) {
          setReloadDocs(!reloadDocs);
          toast.error(
            "Sorry, but the connection with Pinecone has been failed. Try again after a while."
          );
        } else if (res.status == 503) {
          setReloadDocs(!reloadDocs);
          toast.error(
            "Sorry, but deleting documents has been failed. Try again after a while."
          );
        } else if (res.status == 404) {
          setReloadDocs(!reloadDocs);
        } else {
          toast.error("Sorry, An error occurred while deleting the document.");
        }
        setSelectedDocIndex(-1);
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  const onClickClrBtn = () => setShowClrDlg(!showClrDlg);

  const onOkClrDocs = () => {
    setShowClrDlg(!showClrDlg);
    EventBus.dispatch("setLoading", true);

    TrainingService.clearTrainDataByBotId({
      namespace: bot.namespace,
      bot_id: bot.id,
    })
      .then((res) => {
        if (res.status == 200) {
          setReloadDocs(!reloadDocs);
          toast.success("All the documents has been successfully deleted.");
        } else if (res.status == 501) {
          setReloadDocs(!reloadDocs);
          toast.error(
            "Sorry, but the connection with Pinecone has been failed. Try again after a while."
          );
        } else if (res.status == 503) {
          setReloadDocs(!reloadDocs);
          toast.error(
            "Sorry, but clearing documents has been failed. Try again after a while."
          );
        } else {
          toast.error("Sorry, An error occurred while clearing documents.");
        }
        setSelectedDocIndex(-1);
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  const onClickRetrainIcon = (index) => {
    EventBus.dispatch("setLoading", true);
    const selectedDoc = docs[index];

    TrainingService.retraindData({
      id: selectedDoc.id,
      filename: selectedDoc.filename,
      namespace: bot.namespace,
    })
      .then((res) => {
        if (res.status == 200) {
          setReloadDocs(!reloadDocs);
          toast.success(
            "The selected document has been successfully retrained."
          );
        } else if (res.status == 501) {
          toast.error(
            "Sorry, but the connection with Pinecone has been failed. Try again after a while."
          );
        } else {
          toast.error(
            "Sorry, An error occurred while retraining the document."
          );
        }
        setSelectedDocIndex(-1);
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  return (
    <>
      <BotLayout />
      <div className="h-[calc(100vh-275px)] w-full gap-16 md:flex">
        <div className="w-full">
          <QBUpload
            accept={[".docx", ".txt", ".pdf"]}
            onUploadData={onUploadData}
          />
          <List className="h-[calc(100vh-475px)] overflow-auto text-custom-txt-clr">
            {docs.map((doc, index) => {
              return (
                <ListItem key={index} selected={selectedDocIndex === index}>
                  <div className="mr-2">
                    {doc.is_trained ? (
                      <AiOutlineCheck className="text-green-600" />
                    ) : (
                      <AiOutlineClose className="text-red-600" />
                    )}
                  </div>
                  <div
                    className="w-full"
                    onClick={() => setSelectedDocIndex(index)}
                  >
                    {doc.originalname}
                  </div>
                  <div className="flex gap-4 text-lg">
                    {doc.is_trained ? (
                      ""
                    ) : (
                      <AiOutlineCloudSync
                        className="text-orange-400"
                        onClick={() => onClickRetrainIcon(index)}
                      />
                    )}
                    <BsFillTrash3Fill
                      className="text-red-400"
                      onClick={() => {
                        setSelectedDelIconIndex(index);
                        onClickDelIcon();
                      }}
                    />
                  </div>
                </ListItem>
              );
            })}
            {docs.length !== 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  color="red"
                  className="justify-end"
                  onClick={onClickClrBtn}
                >
                  clear
                </Button>
              </div>
            )}
          </List>
        </div>
        <div className={`w-full`}>
          <iframe
            src={
              docs.length && selectedDocIndex !== -1
                ? BASE_URL + docs[selectedDocIndex].doc_url
                : ""
            }
            className="h-full w-full"
          />
        </div>
      </div>
      <QBDialog
        open={showDelDlg}
        handleOpen={onClickDelIcon}
        onOk={onOkDelDoc}
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
        notifyContent="Once you delete this document, all the Q & A related to this will be deleted together."
      />
      <QBDialog
        open={showClrDlg}
        handleOpen={onClickClrBtn}
        onOk={onOkClrDocs}
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
        notifyContent="Once you clear documents, all the training data and Q & A related to this bot will be deleted together."
      />
    </>
  );
};

export default Training;
