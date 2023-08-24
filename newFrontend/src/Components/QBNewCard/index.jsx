import QBButton from "../QBButton";
import { HiPlusSm } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const QBNewCard = () => {
  const navigate = useNavigate();

  return (
    <div className="h-[250px] w-full md:w-[250px]">
      <div className="gradient-border-dashed relative flex h-full w-full items-center justify-center transition-all">
        <QBButton
          className="flex items-center gap-2 bg-custom-btn-clr hover:scale-105"
          onClick={() => navigate("/bot/new")}
        >
          <HiPlusSm className="text-3xl font-normal " />
          <span className="text-base font-normal ">New Bot</span>
        </QBButton>
      </div>
    </div>
  );
};

export default QBNewCard;
