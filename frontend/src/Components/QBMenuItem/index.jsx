import { Link } from "react-router-dom";

const QBMenuItem = ({ href = "", label, icon, selected }) => {
  return (
    <Link
      to={href}
      className={`${
        selected
          ? "bg-custom-btn-clr/75 hover:bg-custom-btn-clr"
          : "hover:bg-custom-btn-clr/20"
      } index-4 mt-2 flex items-center gap-4 rounded-lg p-2 pl-6 transition`}
    >
      <span className="text-base font-bold text-white">{icon}</span>
      <span className="text-base font-bold text-custom-txt-clr">{label}</span>
    </Link>
  );
};

export default QBMenuItem;
