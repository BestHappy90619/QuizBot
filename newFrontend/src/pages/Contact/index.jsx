import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import QBInput from "@/Components/QBInput";
import QBButton from "@/Components/QBButton";
import QBTextArea from "@/Components/QBTextArea";

import toast from "react-hot-toast";
import EventBus from "@/utils/EventBus";
import UserService from "@/services/User";

const Contact = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  const [fromName, setFromName] = useState(
    currentUser ? currentUser?.firstname + " " + currentUser?.lastname : ""
  );
  const [fromEmail, setFromEmail] = useState(
    currentUser ? currentUser.email : ""
  );
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const contact = () => {
    var isError = false;
    if (fromName.length < 3) {
      toast.error("Your name field must be more than 2 characters!");
      isError = true;
    }
    if (
      fromEmail.length == 0 ||
      !fromEmail.includes("@") ||
      fromEmail.endsWith("@") ||
      fromEmail.startsWith("@")
    ) {
      toast.error("Your email field must be valid format!");
      isError = true;
    }
    if (subject.length < 3) {
      toast.error("The subject field must be more than 3 characters!");
      isError = true;
    }
    if (description.length < 5) {
      toast.error("The description field must be more than 5 characters!");
      isError = true;
    }

    if (isError) return;

    EventBus.dispatch("setLoading", true);

    UserService.contact({ fromName, fromEmail, subject, description })
      .then((res) => {
        console.log("res>>>>> ", res);
        if (res.status == 200) {
          toast.success("This email has been successfully sent!");
        } else {
          toast.error("Sorry, An error occurred while sending the email.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  };

  return (
    <div className="grid flex-row gap-8 lg:flex">
      <div className="basis-1/2">
        <div className="grid gap-4">
          <p className="text-3xl text-custom-txt-clr">
            WE'RE READY, LET'S TALK.
          </p>
          <div className=" ml-8 grid gap-4">
            <QBInput
              label="Your name"
              className="text-custom-txt-clr"
              value={fromName}
              onChange={(e) => setFromName(e.target.value)}
            />
            <QBInput
              label="Your email"
              className="text-custom-txt-clr"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
            />
            <QBInput
              label="Subject"
              className="text-custom-txt-clr"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <QBTextArea
              size="md"
              label="Description"
              className="text-custom-txt-clr"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-row">
              <QBButton
                className="basis-1/5 bg-custom-btn-clr"
                onClick={contact}
              >
                Send
              </QBButton>
            </div>
          </div>
        </div>
      </div>
      <div className="basis-1/2 lg:ml-16">
        <div className="grid gap-2 text-custom-txt-clr">
          <p className="text-3xl">CONTACT INFO</p>
          <p className="text-xl">Address</p>
          <p className="text-sm text-custom-gray">
            164 Ruimte Road, Wierdapark,
          </p>
          <p className="text-sm text-custom-gray">Centurion, Gauteng, </p>
          <p className="mb-4 text-sm text-custom-gray">South Africa, 0157 </p>
          <p className="text-xl">Email us</p>
          <p className="mb-4 text-base text-custom-gray">
            info@articulateit.co.za
          </p>
          <p className="text-xl">Call us</p>
          <p className="text-base text-custom-gray">012 654 7106</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
