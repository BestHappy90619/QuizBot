import { useRoutes } from "react-router-dom";
import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";
import { store } from "../redux-toolkit/store";

import { Spinner } from "@material-tailwind/react";
import EventBus from "./utils/EventBus";

import { Toaster } from "react-hot-toast";

function App() {
  const pages = useRoutes(AppRoutes);

  const [isLoading, setIsLoading] = useState(false);

  const setLoading = (data) => {
    setIsLoading(data);
  };

  useEffect(() => {
    EventBus.on("setLoading", (data) => setLoading(data));
  });

  return (
    <Provider store={store}>
      {pages}
      <div
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          zIndex: 999,
          top: 0,
          left: 0,
          display: `${isLoading ? "flex" : "none"}`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner color="yellow" className="h-10 w-10" />
      </div>
      <Toaster />
    </Provider>
  );
}

export default App;
