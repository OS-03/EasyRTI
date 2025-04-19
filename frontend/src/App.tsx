import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signin from "./components/auth/Signin";
import Signup from "./components/auth/Signup";
import Home from "./components/Home";
import "./App.css";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import DepartmentCreate from "./components/admin/DepartmentCreate";
import DepartmentSetup from "./components/admin/DepartmentSetup";
import RequestForm from "./components/RequestForm";
import Department from "./components/admin/Department";
import Applicants from "./components/admin/Applicants";
import ErrorPage from "./components/ErrorPage";
import Dashboard from "./components/admin/Dashboard";
import ContactUs from "./components/shared/ContactUs";
import FAQ from "./components/shared/FAQ";
import UserProtectedRoute from "./components/UserProtectedRoute";
import RequestStatus from "./components/RequestStatus";
import Rules from "./components/Rules";
import PostRequestdemo from "./components/PostRequestdemo";
import CookiesPopover from "./components/CookiesPopover";
import ForgetPassword from "./components/auth/ForgetPassword";


const appRouter = createBrowserRouter([

  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forget-password",
    element: <ForgetPassword />,
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/submitrequest",
    element: <UserProtectedRoute><RequestForm /></UserProtectedRoute>
  },
  {
    path: "/viewstatus",
    element: <UserProtectedRoute><RequestStatus/></UserProtectedRoute>
  },
  {
    path: "/demorequests",
    element: <UserProtectedRoute><PostRequestdemo/></UserProtectedRoute>
  },
  {
    path: "/contact",
    element: <ContactUs />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/faq",
    element: <FAQ />
  },
  {
    path: "/rules",
    element:<UserProtectedRoute><Rules/></UserProtectedRoute>
  },
  {
    path: "/admin/dashboard",
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>
  },
  {
    path: "/admin/department",
    element: <ProtectedRoute><Department /></ProtectedRoute>
  },
  {
    path: "/admin/department/create",
    element: <ProtectedRoute><DepartmentCreate /></ProtectedRoute>
  },
  {
    path: "/admin/department/:id",
    element: <ProtectedRoute><DepartmentSetup /></ProtectedRoute>
  },
  {
    path: "/admin/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
 
  {
    path: "*",
    element: <ErrorPage />
  }
]);


export default function App() {
  return (
    <Container
      maxWidth='xl'
      className="z-50 bg-white p-0 rounded-xl h-screen" //w-screen bg-gradient-to-l from-gray-100 via-orange-100 "
      sx={{
        paddingLeft: "0 !important",
        paddingRight: "0 !important",
      }}

    >

      <RouterProvider router={appRouter} />
      <CookiesPopover/>
    </Container>
  );
}
