import { useContext, useEffect } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { getToken, tokenDuration, logout, getUserName } from "../util/auth";

import Header from "../components/RootLayout/Header";
import AuthContext from "../context/AuthContext";

function RootLayout() {
  const loaderData = useLoaderData();
  const navigate = useNavigate();
  const ctx = useContext(AuthContext);

  useEffect(() => {
    if (loaderData === null) {
      logout();
      return;
    }

    if (loaderData.userName !== null) {
      ctx.onSetUserName(loaderData.userName);
    }

    if (loaderData.token === "EXPIRED") {
      logout();
      return;
    }

    if (loaderData.token === null) {
      return;
    }

    const duration = tokenDuration();
    console.log(duration);

    setTimeout(() => {
      logout();
      ctx.onSetUserName(null);
      navigate("/");
    }, duration);
  }, [loaderData]);

  return (
    <div>
      <Header />

      <Outlet />
    </div>
  );
}

export default RootLayout;

export function loader() {
  if (localStorage.getItem("token")) {
    const userName = getUserName();
    const token = getToken();
    const data = { userName: userName, token: token };
    return data;
  }
  return null;
}
