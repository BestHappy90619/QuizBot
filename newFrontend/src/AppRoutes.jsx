import Layout from "./Layouts/Layout";
import AuthLayout from "./Layouts/AuthLayout";
import Bot from "./pages/Bot";
import NewBot from "./pages/Bot/New";
import EditBot from "./pages/Bot/Edit";
import ChatWithBot from "./pages/Bot/Chat";
import Training from "./pages/Bot/Training";
import SignIn from "./pages/Auth/signin";
import SignUp from "./pages/Auth/signup";
import Contact from "./pages/Contact";
import NotFoundPage from "./pages/NotFoundPage";
// import Subscription from "./pages/Subscription";
import Profile from "./pages/Profile";
import QA from "./pages/Bot/QA";

const AppRoutes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Bot />,
      },
      {
        path: "/bot/new",
        element: <NewBot />,
      },
      {
        path: "/bot/chat",
        element: <ChatWithBot />,
      },
      {
        path: "/bot/training",
        element: <Training />,
      },
      {
        path: "/bot/qa",
        element: <QA />,
      },
      {
        path: "/bot/edit",
        element: <EditBot />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      // {
      //   path: "/subscription",
      //   element: <Subscription />,
      // },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default AppRoutes;
