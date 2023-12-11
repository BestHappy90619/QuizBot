import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ADMIN_ROLE } from "@/utils/global";

import QBInput from "@/Components/QBInput";
import QBDialog from "@/Components/QBDialog";
import BotLayout from "@/Layouts/BotLayout";

import {
  Typography,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Select,
  Option,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import { toast } from "react-hot-toast";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineSearch } from "react-icons/hi";
import { BsFillTrash3Fill } from "react-icons/bs";

import TrainingService from "@/services/Training";
import QAService from "@/services/QA";

import EventBus from "@/utils/EventBus";
import { parseURLParams } from "@/utils/global";
import QBTextArea from "@/Components/QBTextArea";

const QA = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (currentUser?.role != ADMIN_ROLE) {
    return <Navigate to="/" />;
  }

  const [activeTab, setActiveTab] = useState(0);
  const [isMCQ, setIsMCQ] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState("-1");
  const [selectedPage, setSelectedPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [trainingDocs, setTrainingDocs] = useState([]);
  const [qas, setQAs] = useState([]);
  const [selectedPagesize, setSelectedPagesize] = useState("5");
  const [search, setSearch] = useState("");
  const [showDelDlg, setShowDelDlg] = useState(false);
  const [selectedDelQAId, setSelectedDelQAId] = useState(-1);
  const [showEditDlg, setShowEditDlg] = useState(false);
  const [selectedEditQAId, setSelectedEditQAId] = useState(-1);
  const [editSelectedLevel, setEditSelectedLevel] = useState("0");
  const [editQuestion, setEditQuestion] = useState("");
  const [editCMAnswer, setEditCMAnswer] = useState("");
  const [editMCQAnswer, setEditMCQAnswer] = useState("0");
  const [editMCQOptionA, setEditMCQOptionA] = useState("");
  const [editMCQOptionB, setEditMCQOptionB] = useState("");
  const [editMCQOptionC, setEditMCQOptionC] = useState("");
  const [editMCQOptionD, setEditMCQOptionD] = useState("");
  const [reloadQA, setReloadQA] = useState(false);
  const [showAddDlg, setShowAddDlg] = useState(false);
  const [addSelectedLevel, setAddSelectedLevel] = useState("0");
  const [addIsMCQ, setAddIsMCQ] = useState(false);
  const [addSelectedQATraining, setAddSelectedQATraining] = useState("-1");
  const [addQATrainings, setAddQATrainings] = useState([]);
  const [addQANum, setAddQANum] = useState(12);
  const [addQAMax, setAddQAMax] = useState(6);

  const TABS = [
    {
      label: "Low",
      value: 0,
    },
    {
      label: "Middle",
      value: 1,
    },
    {
      label: "High",
      value: 2,
    },
  ];
  const CM_TABLE_HEAD = ["Question", "Answer", "Operation"];
  const MC_TABLE_HEAD = ["Question", "Options", "Answer", "Operation"];
  const PAGESIZE = [
    {
      name: "5",
      size: 5,
    },
    {
      name: "10",
      size: 10,
    },
    {
      name: "25",
      size: 25,
    },
    {
      name: "50",
      size: 50,
    },
    {
      name: "All",
      size: -1,
    },
  ];

  var urlParams = parseURLParams(window.location.href);
  const botId = urlParams["id"][0];

  useEffect(() => {
    if (botId == undefined) return;
    EventBus.dispatch("setLoading", true);
    TrainingService.getAllTrainDataByBot(botId)
      .then((res) => {
        if (res.status == 200 || res.status == 404) {
          setTrainingDocs([
            { id: "-1", originalname: "All" },
            ...res.data.data,
          ]);
          setAddQATrainings(res.data.data);
        } else if (res.status) {
          toast.error(
            "Sorry, An error occurred while getting the document list."
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
    EventBus.dispatch("setLoading", true);

    QAService.getQAs({
      level: activeTab,
      isMCQ,
      traindata_id: selectedDoc * 1,
      selectedPage,
      selectedPagesize: selectedPagesize * 1,
      search,
    })
      .then((res) => {
        if (res.status == 200 || res.status == 404) {
          setQAs(res.data.data.qas);
          if (selectedPagesize < 0) {
            setTotalPage(1);
            setSelectedPage(1);
          } else {
            setTotalPage(
              Math.floor(res.data.data.total / selectedPagesize) + 1
            );
            if (
              selectedPage >
              Math.floor(res.data.data.total / selectedPagesize) + 1
            )
              setSelectedPage(
                Math.floor(res.data.data.total / selectedPagesize) + 1
              );
          }
        } else if (res.status) {
          toast.error("Sorry, An error occurred while getting the Q & A.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  }, [
    activeTab,
    isMCQ,
    selectedDoc,
    selectedPage,
    selectedPagesize,
    search,
    reloadQA,
  ]);

  const onClickDelQA = () => setShowDelDlg(!showDelDlg);

  const onOKDelQA = () => {
    setShowDelDlg(!showDelDlg);

    EventBus.dispatch("setLoading", true);

    QAService.delQAById({ id: selectedDelQAId, isMCQ })
      .then((res) => {
        if (res.status == 200) {
          toast.success("The selected Q & A has been successfully deleted.");
          setReloadQA(!reloadQA);
        } else {
          toast.error("Sorry, An error occurred while deleting the Q & A.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  const onClickEditQA = () => setShowEditDlg(!showEditDlg);

  useEffect(() => {
    if (!showEditDlg) return;
    QAService.getQAById({ id: selectedEditQAId, isMCQ })
      .then((res) => {
        if (res.status == 200) {
          var editQA = res.data.data;
          setEditQuestion(editQA.question);
          setEditSelectedLevel(editQA.qlevel + "");
          if (isMCQ) {
            setEditMCQAnswer(editQA.answer);
            setEditMCQOptionA(editQA.option_a);
            setEditMCQOptionB(editQA.option_b);
            setEditMCQOptionC(editQA.option_c);
            setEditMCQOptionD(editQA.option_d);
          } else setEditCMAnswer(editQA.answer);
        } else {
          toast.error(
            "Sorry, An error occurred while getting the selected Q & A."
          );
        }
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
      });
  }, [showEditDlg]);

  const onOKEditQA = () => {
    setShowEditDlg(!showEditDlg);
    EventBus.dispatch("setLoading", true);

    const updatedInfo = isMCQ
      ? {
          editQuestion,
          editSelectedLevel,
          editMCQAnswer,
          editMCQOptionA,
          editMCQOptionB,
          editMCQOptionC,
          editMCQOptionD,
        }
      : {
          editQuestion,
          editSelectedLevel,
          editCMAnswer,
        };

    QAService.editQAById({ id: selectedEditQAId, isMCQ, updatedInfo })
      .then((res) => {
        if (res.status == 200) {
          toast.success("The selected Q & A has been successfully updated.");
          setReloadQA(!reloadQA);
        } else {
          toast.error("Sorry, An error occurred while updating the Q & A.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  const onClickAddQA = () => setShowAddDlg(!showAddDlg);

  useEffect(() => {
    if (!showAddDlg) return;
    setAddSelectedLevel("0");
    setAddIsMCQ(false);
    setAddSelectedQATraining("-1");
    setAddQANum(1);
    setAddQAMax(12);
  }, [showAddDlg]);

  useEffect(() => {
    if (addIsMCQ) {
      setAddQAMax(6);
      setAddQANum(6);
    } else {
      setAddQAMax(12);
      setAddQANum(12);
    }
  }, [addIsMCQ]);

  const onOKAddQA = () => {
    setShowAddDlg(!showAddDlg);
    if (addSelectedQATraining == "-1") {
      toast.error("Please select the document.");
      return;
    }
    if (addQANum < 1 || addQANum > addQAMax) {
      toast.error(
        "The number of Q & A to extract must be between 1 and " + addQAMax + "."
      );
      return;
    }

    EventBus.dispatch("setLoading", true);

    QAService.addQAs({
      level: addSelectedLevel * 1,
      isMCQ: addIsMCQ ? 1 : 0,
      traindata_id: addSelectedQATraining,
      num: addQANum,
    })
      .then((res) => {
        if (res.status == 200) {
          toast.success("New Q & A has been successfully extracted.");
          setReloadQA(!reloadQA);
        } else if (res.status == 204) {
          toast.success(
            "There are no more Q & A to extract for the selected document."
          );
        } else {
          toast.error("Sorry, An error occurred while extracting the Q & A.");
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
      <BotLayout />
      <div className="mx-8 mt-4 flex flex-col items-center justify-between gap-4 xl:flex-row">
        <Button
          size="sm"
          className="bg-custom-btn-clr text-white"
          onClick={onClickAddQA}
        >
          ADD
        </Button>
        <div className="flex gap-16">
          <Tabs value={activeTab} className="w-full">
            <TabsHeader
              className="rounded-none  bg-transparent p-0"
              indicatorProps={{
                className: "bg-transparent shadow-none rounded-none",
              }}
            >
              {TABS.map(({ label, value }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setActiveTab(value)}
                  className={
                    activeTab === value
                      ? "border-b-2 border-yellow-300 text-yellow-500 "
                      : "text-custom-gray"
                  }
                >
                  {label}
                </Tab>
              ))}
            </TabsHeader>
          </Tabs>
          <Switch
            label={<p className="text-black">MCQ</p>}
            color="yellow"
            checked={isMCQ}
            onChange={(e) => setIsMCQ(e.target.checked)}
          />
        </div>
        <div>
          <Select
            label="Select Training Data"
            color="yellow"
            className="text-custom-txt-clr"
            // value={selectedDoc}
            onChange={(val) => setSelectedDoc(val)}
          >
            {trainingDocs.map((doc) => {
              return (
                <Option key={doc.id} value={doc.id + ""}>
                  {doc.originalname}
                </Option>
              );
            })}
          </Select>
        </div>
        <div>
          <QBInput
            icon={<HiOutlineSearch />}
            label="Search for QA"
            variant="standard"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <table className="mt-4 w-full table-auto text-left">
        <thead className="border-b-2 border-yellow-200 border-opacity-20">
          <tr>
            {(isMCQ ? MC_TABLE_HEAD : CM_TABLE_HEAD).map((head) => (
              <th key={head} className=" p-4">
                <Typography
                  variant="small"
                  color="yellow"
                  className="font-normal leading-none"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {qas.map((item, index) => (
            <tr
              key={index}
              className="h-[80px] border-b-2 border-yellow-200 border-opacity-20 text-custom-txt-clr"
            >
              <td>{item.question}</td>
              {isMCQ && (
                <td>
                  <ul>
                    <li>A. {item.option_a}</li>
                    <li>B. {item.option_b}</li>
                    <li>C. {item.option_c}</li>
                    <li>D. {item.option_d}</li>
                  </ul>
                </td>
              )}
              <td style={isMCQ ? { textAlign: "center" } : {}}>
                {isMCQ
                  ? String.fromCharCode(64 + item.answer * 1 + 1)
                  : item.answer}
              </td>
              <td style={{ textAlign: "center" }}>
                <div className="flex justify-center gap-4">
                  <Tooltip
                    className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
                    content="Edit"
                  >
                    <div>
                      <AiOutlineEdit
                        color="orange"
                        size="15px"
                        cursor={"pointer"}
                        onClick={() => {
                          setSelectedEditQAId(item.id);
                          onClickEditQA();
                        }}
                      />
                    </div>
                  </Tooltip>
                  <Tooltip
                    className="border border-custom-txt-clr bg-opacity-0 px-4 py-3 text-custom-txt-clr"
                    content="Delete"
                  >
                    <div>
                      <BsFillTrash3Fill
                        color="red"
                        size="15px"
                        cursor={"pointer"}
                        onClick={() => {
                          setSelectedDelQAId(item.id);
                          onClickDelQA();
                        }}
                      />
                    </div>
                  </Tooltip>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 justify-between md:flex ">
        <Typography
          variant="small"
          color="yellow"
          className="self-center font-normal"
          style={{ textAlign: "center" }}
        >
          Page {selectedPage} of {totalPage}
        </Typography>
        <div className="mt-4 gap-4 md:flex">
          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              className="bg-custom-btn-clr"
              onClick={() => setSelectedPage(selectedPage - 1)}
              disabled={selectedPage < 2}
            >
              Previous
            </Button>
            <Button
              size="sm"
              className="bg-custom-btn-clr"
              onClick={() => setSelectedPage(selectedPage + 1)}
              disabled={selectedPage > totalPage - 1}
            >
              Next
            </Button>
          </div>
          <div className="mt-4 self-center md:mt-0">
            <Select
              label="Page size"
              color="yellow"
              className="text-custom-txt-clr"
              value={selectedPagesize}
              onChange={(val) => setSelectedPagesize(val)}
            >
              {PAGESIZE.map((item) => {
                return (
                  <Option key={item.size} value={item.size + ""}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
      </div>
      <QBDialog
        open={showDelDlg}
        handleOpen={onClickDelQA}
        onOk={onOKDelQA}
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
      <Dialog
        open={showEditDlg}
        handler={onClickEditQA}
        className="gradient-border-solid bg-[rgba(0,0,0,0.2)]"
      >
        <DialogHeader>
          <Typography color="white" variant="h5">
            Edit Q & A
          </Typography>
        </DialogHeader>
        <DialogBody divider className="grid place-items-center gap-4">
          <div className="mb-8 flex w-full gap-4">
            <div className="w-5/6">
              <QBInput
                label="Question"
                className="text-white"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
              />
            </div>
            <div>
              <Select
                label="Level"
                color="yellow"
                className="text-white"
                value={editSelectedLevel}
                onChange={(val) => setEditSelectedLevel(val)}
              >
                <Option value="0">Low</Option>
                <Option value="1">Middle</Option>
                <Option value="2">High</Option>
              </Select>
            </div>
          </div>
          {isMCQ ? (
            <>
              <div className="grid w-full gap-4">
                <div className="mr-4 mb-4 flex items-center">
                  <input
                    id="option_a"
                    type="radio"
                    name="MCQOption"
                    className="hidden"
                    value="0"
                    checked={editMCQAnswer === "0"}
                    onChange={(e) => setEditMCQAnswer(e.target.value)}
                  />
                  <label
                    htmlFor="option_a"
                    className="flex w-full cursor-pointer items-center"
                  >
                    <span className="border-grey flex-no-shrink mr-4 inline-block h-5 w-5 rounded-full border"></span>
                    <QBInput
                      label="Option A"
                      className="text-white"
                      value={editMCQOptionA}
                      onChange={(e) => setEditMCQOptionA(e.target.value)}
                    />
                  </label>
                </div>

                <div className="mr-4 mb-4 flex items-center">
                  <input
                    id="option_b"
                    type="radio"
                    name="MCQOption"
                    className="hidden"
                    value="1"
                    checked={editMCQAnswer === "1"}
                    onChange={(e) => setEditMCQAnswer(e.target.value)}
                  />
                  <label
                    htmlFor="option_b"
                    className="flex w-full cursor-pointer items-center"
                  >
                    <span className="border-grey flex-no-shrink mr-4 inline-block h-5 w-5 rounded-full border"></span>
                    <QBInput
                      className="text-white"
                      label="Option B"
                      value={editMCQOptionB}
                      onChange={(e) => setEditMCQOptionB(e.target.value)}
                    />
                  </label>
                </div>

                <div className="mr-4 mb-4 flex items-center">
                  <input
                    id="option_c"
                    type="radio"
                    name="MCQOption"
                    className="hidden"
                    value="2"
                    checked={editMCQAnswer === "2"}
                    onChange={(e) => setEditMCQAnswer(e.target.value)}
                  />
                  <label
                    htmlFor="option_c"
                    className="flex w-full cursor-pointer items-center"
                  >
                    <span className="border-grey flex-no-shrink mr-4 inline-block h-5 w-5 rounded-full border"></span>
                    <QBInput
                      className="text-white"
                      label="Option C"
                      value={editMCQOptionC}
                      onChange={(e) => setEditMCQOptionC(e.target.value)}
                    />
                  </label>
                </div>

                <div className="mr-4 mb-4 flex items-center">
                  <input
                    id="option_d"
                    type="radio"
                    name="MCQOption"
                    className="hidden"
                    value="3"
                    checked={editMCQAnswer === "3"}
                    onChange={(e) => setEditMCQAnswer(e.target.value)}
                  />
                  <label
                    htmlFor="option_d"
                    className="flex w-full cursor-pointer items-center"
                  >
                    <span className="border-grey flex-no-shrink mr-4 inline-block h-5 w-5 rounded-full border"></span>
                    <QBInput
                      className="text-white"
                      label="Option D"
                      value={editMCQOptionD}
                      onChange={(e) => setEditMCQOptionD(e.target.value)}
                    />
                  </label>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full">
                <QBTextArea
                  size="md"
                  color="cyan"
                  label="Answer"
                  value={editCMAnswer}
                  onChange={(e) => setEditCMAnswer(e.target.value)}
                />
              </div>
            </>
          )}
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" onClick={onOKEditQA} color="blue-gray">
            SAVE CHANGES
          </Button>
          <Button className="bg-custom-btn-clr" onClick={onClickEditQA}>
            CANCECL
          </Button>
        </DialogFooter>
      </Dialog>
      <Dialog
        open={showAddDlg}
        handler={onClickAddQA}
        className="gradient-border-solid bg-[rgba(0,0,0,0.2)]"
      >
        <DialogHeader>
          <Typography color="white" variant="h5">
            Add Q & A
          </Typography>
        </DialogHeader>
        <DialogBody
          divider
          className="grid grid-cols-2 place-items-center gap-4"
        >
          <Select
            label="Level"
            color="yellow"
            className="text-white"
            value={addSelectedLevel}
            onChange={(val) => setAddSelectedLevel(val)}
          >
            <Option value="0">Low</Option>
            <Option value="1">Middle</Option>
            <Option value="2">High</Option>
          </Select>
          <Switch
            label={<p className="text-white">MCQ</p>}
            color="yellow"
            checked={addIsMCQ}
            onChange={(e) => setAddIsMCQ(e.target.checked)}
          />
          <Select
            label="Select Training Data"
            color="yellow"
            className="text-white"
            // value={selectedDoc}
            onChange={(val) => setAddSelectedQATraining(val)}
          >
            {addQATrainings.map((doc) => {
              return (
                <Option key={doc.id} value={doc.id + ""}>
                  {doc.originalname}
                </Option>
              );
            })}
          </Select>
          <QBInput
            type="number"
            label="Search for QA"
            className="text-white"
            variant="standard"
            min="1"
            max={addQAMax}
            value={addQANum}
            onChange={(e) => setAddQANum(e.target.value)}
          />
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="text" onClick={onOKAddQA} color="blue-gray">
            START
          </Button>
          <Button onClick={onClickAddQA} className="bg-custom-btn-clr">
            CANCECL
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default QA;
