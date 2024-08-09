import React from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Login from "../views/pages/login/Login";
import Dashboard from "../views/dashboard/Dashboard";
import { getFromLocalStorage } from "../utils/LocalStorageUtills";
import DefaultLayout from "../layout/DefaultLayout";

// DashboardProtected Component
const DashboardProtected = () => {
  const admin = getFromLocalStorage("useruid");
  return admin ? <Outlet /> : <Navigate to="/login" />;
};

// LoginProtected Component
const LoginProtected = () => {
  const admin = getFromLocalStorage("useruid");
  return admin ? <Navigate to="/dashboard" /> : <Outlet />;
};

// Root Component that handles "/" route
const RootRedirect = () => {
  const admin = getFromLocalStorage("useruid");
  return admin ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/", // Root path
    element: <RootRedirect />, // Handle redirection based on authentication
  },
  {
    path: "/login",
    element: <LoginProtected />, // Protect the login route
    children: [
      {
        path: "", // This will match "/login"
        element: <Login />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardProtected />, // Protect the dashboard route
    children: [
      {
        path: "", // This will match "/dashboard"
        element: (
          <DefaultLayout>
            <Dashboard />
          </DefaultLayout>
        ),
      },
    ],
  },
  {
    path: "*", // Catch-all for any undefined routes
    element: (
      <DefaultLayout>
        <Navigate to="/login" />
      </DefaultLayout>
    ), // Redirect to login
  },
]);

export default router;
