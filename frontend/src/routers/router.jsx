import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import AboutUs from "../pages/AboutUsPage";
import Summarizer from "../pages/Summarizer";
import SessionCard from './../pages/SessionCard';
import Scheduler from "../pages/Scheduler";
import ProfilePage from "../pages/ProfilePage";
import Register from "../components/Authentication/Register";
import Login from "../components/Authentication/Login";
import VerifyEmail from "../components/Authentication/VerifyEmail";
import IntroPage from "../pages/IntroPage";
import ForgotPassword from "../components/Authentication/ForgotPassword";
import ResetPassword from "../components/Authentication/ResetPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/Summarizer",
        element: <Summarizer/>
      },
      {
        path: "/Home",
        element: <HomePage/>
      },
      {
        path: "/Sessions",
        element: <SessionCard/>
      },
      {
        path: "/Scheduler",
        element: <Scheduler/>
      },
      {
        path: "/Profile",
        element: <ProfilePage/>
      }

    ],
  },
  {
    path: "/Signup",
    element: <Register/>
  },
  {
    path: "verify-email",
    element: <VerifyEmail/>
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/forgot-password", 
    element: <ForgotPassword />
  },
  {
    path: "/reset-password", 
    element: <ResetPassword />
  }, 
  {
    path: "/Intro",
    element: <IntroPage/>
  },
  {
    path: "/AboutUs",
    element: <AboutUs />,
  },
]);

export default router;
