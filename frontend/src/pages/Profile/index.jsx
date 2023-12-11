import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import toast from "react-hot-toast";

import {
  changeProfile,
  changePassword,
} from "../../../redux-toolkit/reducers/auth";
import { clearMessage } from "../../../redux-toolkit/reducers/message";
import EventBus from "@/utils/EventBus";

import QBInput from "@/Components/QBInput";
import QBButton from "@/Components/QBButton";

const Profile = () => {
  const dispatch = useDispatch();

  const { user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);

  const [openAccordion, SetOpenAccordion] = useState(0);
  const [email, setEmail] = useState(currentUser.email);
  const [firstname, setFirstname] = useState(currentUser.firstname);
  const [lastname, setLastname] = useState(currentUser.lastname);
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confPwd, setConfPwd] = useState("");

  useEffect(() => {
    if (message) toast.error(message);
    dispatch(clearMessage());
  }, [message]);

  const handleOpenAccordion = (id) => {
    SetOpenAccordion(id);
  };

  const onSubmitChangeProfile = () => {
    var isError = false;
    if (
      email.length == 0 ||
      !email.includes("@") ||
      email.endsWith("@") ||
      email.startsWith("@")
    ) {
      toast.error("Please enter a valid email address.");
      isError = true;
    }
    if (firstname.length < 2) {
      toast.error(
        "The firstname must be required, and also at least 2 characters."
      );
      isError = true;
    }
    if (lastname.length < 2) {
      toast.error(
        "The lastname must be required, and also at least 2 characters."
      );
      isError = true;
    }

    if (isError) return;

    EventBus.dispatch("setLoading", true);

    dispatch(changeProfile({ id: currentUser.id, email, firstname, lastname }))
      .unwrap()
      .then(() => {
        EventBus.dispatch("setLoading", false);
        toast.success("Your profile has been successfully updated");
      })
      .catch(() => {
        EventBus.dispatch("setLoading", false);
      });
  };

  const onSubmitChangePwd = () => {
    var isError = false;
    if (newPwd.length < 6) {
      toast.error(
        "The new password is required, and also at least 6 characters."
      );
      isError = true;
    }
    if (confPwd !== newPwd) {
      toast.error("The confirm password is not equal to the above.");
      isError = true;
    }

    if (isError) return;

    EventBus.dispatch("setLoading", true);

    dispatch(changePassword({ id: currentUser.id, oldP: oldPwd, newP: newPwd }))
      .unwrap()
      .then(() => {
        EventBus.dispatch("setLoading", false);
        toast.success("Your password has been successfully updated.");
        setOldPwd("");
        setNewPwd("");
        setConfPwd("");
      })
      .catch(() => {
        EventBus.dispatch("setLoading", false);
      });
  };

  const UserInfo = (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid gap-4">
        <div>
          <QBInput
            label="Email"
            className="text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <QBInput
              label="Firstname"
              className="text-white"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
          </div>
          <div>
            <QBInput
              label="Lastname"
              className="text-white"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <QBButton
            color="orange"
            className="flex w-full basis-1/3 items-center justify-center gap-3"
            onClick={onSubmitChangeProfile}
          >
            Save Changes
          </QBButton>
        </div>
      </div>
    </div>
  );

  const Password = (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="grid gap-4">
        <div>
          <QBInput
            type="password"
            label="Old"
            className="text-white"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <QBInput
              type="password"
              label="New"
              className="text-white"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
          </div>
          <div>
            <QBInput
              type="password"
              label="Confirm"
              className="text-white"
              value={confPwd}
              onChange={(e) => setConfPwd(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <QBButton
            color="red"
            className="flex w-full basis-1/4 items-center justify-center gap-3"
            onClick={onSubmitChangePwd}
          >
            Change
          </QBButton>
        </div>
      </div>
    </div>
  );

  const accordionPanel = [
    {
      title: "User Info",
      content: UserInfo,
    },
    { title: "Password", content: Password },
  ];

  return (
    <div className="h-full">
      <div className="m-auto h-full overflow-auto px-2">
        {accordionPanel.map((item, index) => {
          const { title, content } = item;
          return (
            <Accordion
              key={index}
              open={openAccordion === index}
              className={`mb-2 rounded-lg bg-[rgba(0,0,0,0.6)] backdrop-blur-sm ${
                openAccordion === index
                  ? "border  border-yellow-500"
                  : "border border-gray-900"
              }`}
            >
              <AccordionHeader
                onClick={() => handleOpenAccordion(index)}
                className={`w-full overflow-hidden border-b-0 p-4 text-white hover:text-white`}
              >
                <p>{title}</p>
              </AccordionHeader>
              <AccordionBody className="h-[calc(100vh-500px)] overflow-y-auto border-t border-yellow-500 p-4 text-base font-normal">
                {content}
              </AccordionBody>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
