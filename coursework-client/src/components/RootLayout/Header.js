import logo from "../../assets/AppLogo1.jpg";
import React, { useContext } from "react";
import classes from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { logout } from "../../util/auth";

function Header() {
  const ctx = useContext(AuthContext);
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    ctx.onSetUserName(null);
    navigate("/")
  }

  return (
    <div className={classes["header"]}>
      <div>
        <img className={classes["logo"]} src={logo} />
      </div>
      <div className={classes["header-button-section"]}>
      <h1 className={classes["username"]}>{ctx.userName === null ? " " : ctx.userName}</h1>
        {ctx.userName === null ? (
          <Link
            to="loginSignup?mode=login"
            className={classes["btn"]}
          >{`Log in / Sign up`}</Link>
        ) : (
          <Link onClick={onLogout} className={classes["btn"]}>Log out</Link>
        )}
      </div>
    </div>
  );
}

export default Header;
