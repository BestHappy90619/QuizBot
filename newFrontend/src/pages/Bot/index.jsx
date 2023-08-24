import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import toast from "react-hot-toast";

import BotService from "@/services/Bot";
import EventBus from "@/utils/EventBus";

import QBNewCard from "@/Components/QBNewCard";
import QBOldCard from "@/Components/QBOldCard";
import { ADMIN_ROLE } from "@/utils/global";

const Bot = () => {
  const [bots, setBots] = useState([]);
  const [search, setSearch] = useState("");

  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    EventBus.dispatch("setLoading", true);

    BotService.searchBot({ search })
      .then((res) => {
        if (res.status == 200 || res.status == 404) {
          setBots(res.data.data);
        } else {
          toast.error("Sorry, An error occurred while getting the bots.");
        }
        EventBus.dispatch("setLoading", false);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Sorry, but there seem to be some problem on our site.");
        EventBus.dispatch("setLoading", false);
      });
  }, [search]);

  useEffect(() => {
    EventBus.on("searchBot", (search) => setSearch(search));
  }, []);

  const onEmptyBots = () => {
    setBots([]);
  };

  return (
    <div className="flex w-full flex-wrap gap-4">
      {currentUser?.role == ADMIN_ROLE && <QBNewCard />}
      {bots.map((bot) => {
        return (
          <QBOldCard
            key={bot.id}
            name={bot.bot_name}
            description={bot.description}
            srcAvatar={bot.img_url}
            id={bot.id}
            namespace={bot.namespace}
            onEmptyBots={onEmptyBots}
          />
        );
      })}
    </div>
  );
};

export default Bot;
