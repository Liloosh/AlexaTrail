import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import React from "react";
import RootLayout, { loader as rootLoader } from "./pages/RootLayout";
import StartPage from "./pages/StartPage";
import LoginSignupPage, {
  action as loginSignupAction,
} from "./pages/LoginSignupPage";
import ErrorPage from "./pages/ErrorPage";
import HomePage, {
  loader as homePageLoader,
  action as homePageAction,
} from "./pages/HomePage";
import CreationFormPage, {
  action as creationAction,
} from "./pages/CreationFormPage";
import CreationPage, {
  action as creationPageAction,
  loader as creationPageLoader,
} from "./pages/CreationPage";
import UpdateRefsGroup, {
  action as updatePageAction,
} from "./pages/UpdateRefsGroup";
import PageForUsers, {
  loader as PageForUsersLoader,
} from "./pages/PageForUsers";
import EmailVerificationPage, {
  action as EmailVerificationAction,
} from "./pages/EmailVerificationPage";
import CheckYourEmailPage from "./pages/CheckYourEmailPage";
import { StyledEngineProvider } from "@mui/material";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      loader: rootLoader,
      children: [
        { index: true, element: <StartPage /> },
        {
          path: "loginSignup",
          element: <LoginSignupPage />,
          action: loginSignupAction,
        },
        {
          path: ":userId",
          children: [
            {
              index: true,
              element: <HomePage />,
              loader: homePageLoader,
              action: homePageAction,
            },
            {
              path: "creation",
              element: <CreationFormPage />,
              action: creationAction,
            },
            {
              path: ":refsPageId",
              element: <CreationPage />,
              action: creationPageAction,
              loader: creationPageLoader,
            },
            {
              path: "updateRefsGroup",
              element: <UpdateRefsGroup />,
              action: updatePageAction,
            },
          ],
        },
      ],
    },
    {
      path: "/personalPage",
      children: [
        {
          path: ":pageGroupName",
          element: <PageForUsers />,
          loader: PageForUsersLoader,
        },
      ],
    },
    {
      path: "/verificationToken",
      children: [
        {
          path: ":verificationToken",
          element: <EmailVerificationPage />,
          action: EmailVerificationAction,
        },
      ],
    },
    {
      path: "/checkEmailPage",
      element: <CheckYourEmailPage />,
    },
  ]);

  return (
    <StyledEngineProvider injectFirst>
      <RouterProvider router={router} />
    </StyledEngineProvider>
  );
}

export default App;
