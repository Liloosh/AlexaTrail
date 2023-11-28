import React, { useEffect, useState } from "react";
import classes from "./LoginSignup.module.css";
import {
  Link,
  useActionData,
  useNavigate,
  useSearchParams,
  useNavigation,
  useSubmit,
} from "react-router-dom";

function LoginSignup() {
  const navigation = useNavigation();

  const errors = useActionData();
  const [registerIsValid, setRegisterIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [nameIsValid, setNameIsValid] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();

  useEffect(() => {
    if (errors == null) {
      return;
    }
    if (errors.message === "Email is not valid") {
      setEmailIsValid(false);
      setEmailError("Email is not valid");
      return;
    }
    if (errors.message === "Password is not valid") {
      setPasswordIsValid(false);
      return;
    }
    if (errors.message === "Name is not unique") {
      setNameIsValid(false);
      setNameError("Name is not unique");
    }
    if (errors.message === "Email is not unique") {
      setEmailIsValid(false);
      setEmailError("Email is not unique");
    }
    if (errors.message === "email is not correct") {
      setEmailIsValid(false);
      setEmailError("Email is invalid");
    }
    if (errors.message === "password is not correct") {
      setPasswordIsValid(false);
    }
  }, [errors]);

  const onSubmit = () => {
    if (searchParams.get("mode") === "login") {
      if (email === "" || password === "") {
        if (email === "") {
          setEmailIsValid(false);
          setEmailError("This is invalid login");
        }
        if (password === "") {
          setPasswordIsValid(false);
        }
        return;
      }
      return submit({ email, password }, { method: "POST" });
    } else if (searchParams.get("mode") === "register") {
      if (userName === "" || email === "" || password === "") {
        if (email === "") {
          setEmailIsValid(false);
          setEmailError("This is invalid email");
        }
        if (password === "") {
          setPasswordIsValid(false);
        }
        if (userName === "") {
          setNameIsValid(false);
          setNameError("This username is invalid");
        }
        return;
      }
      return submit({ userName, email, password }, { method: "POST" });
    }
  };

  const onUserNameSet = (event) => {
    setUserName(event.target.value);
    if (event.target.value === "") {
      setNameIsValid(false);
      setNameError("This is invalid name");
      return;
    }
    setNameIsValid(true);
    setNameError("");
  };

  const onEmailSet = (event) => {
    setEmail(event.target.value);
    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailPattern.test(event.target.value)) {
      setEmailIsValid(false);
      setEmailError("This is invalid login");
      return;
    }
    if (event.target.value === "") {
      setEmailIsValid(false);
      setEmailError("This is invalid login");
      return;
    }
    setEmailIsValid(true);
  };

  const onPasswordSet = (event) => {
    setPassword(event.target.value);
    if (event.target.value === "") {
      setPasswordIsValid(false);
      return;
    }
    setPasswordIsValid(true);
  };

  useEffect(() => {
    if (touched === false) {
      navigate("?mode=login");
    }
  }, []);

  const registerHandler = () => {
    setEmail("");
    setPassword("");
    setEmailIsValid(true);
    setPasswordIsValid(true);
    setRegisterIsValid(true);
    setTouched(false);
  };

  const loginHandler = () => {
    setUserName("");
    setPassword("");
    setEmail("");
    setNameIsValid(true);
    setEmailIsValid(true);
    setPasswordIsValid(true);
    setRegisterIsValid(false);
    setTouched(true);
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["date-container"]}>
        <div
          className={`${classes["form-container"]} ${
            registerIsValid && classes["move-register-in"]
          } ${!registerIsValid && touched && classes["move-register-out"]}`}
        >
          <h1
            className={`${classes["component"]} ${classes["last-component"]}`}
          >
            Register hare
          </h1>
          <div className={classes["component"]}>
            <input
              onChange={onUserNameSet}
              onBlur={onUserNameSet}
              className={`${classes["input"]}`}
              type="text"
              placeholder="Name"
              name="userName"
              value={userName}
            />
            <span
              className={`${
                nameIsValid ? classes["valid-msg"] : classes["invalid-msg"]
              }`}
            >
              {nameError}
            </span>
          </div>
          <div className={classes["component"]}>
            <input
              onBlur={onEmailSet}
              onChange={onEmailSet}
              className={` ${classes["input"]}`}
              type="email"
              name="email"
              placeholder="E-mail"
              value={email}
            />
            <span
              className={`${
                emailIsValid ? classes["valid-msg"] : classes["invalid-msg"]
              }`}
            >
              {emailError}
            </span>
          </div>
          <div
            className={`${classes["component"]} ${classes["last-component"]}`}
          >
            <input
              onBlur={onPasswordSet}
              onChange={onPasswordSet}
              className={`${classes["input"]}`}
              type="password"
              name="password"
              placeholder="Password"
              value={password}
            />
            <span
              className={`${
                passwordIsValid ? classes["valid-msg"] : classes["invalid-msg"]
              }`}
            >
              This is invalid password
            </span>
          </div>
          <button
            onClick={onSubmit}
            className={`${classes["component"]} ${classes["btn"]}`}
          >
            {navigation.state === "submitting" ? "Submitting..." : "Register"}
          </button>
        </div>

        <div
          className={`${classes["form-container"]} ${
            registerIsValid && classes["move-login-out"]
          } ${!registerIsValid && touched && classes["move-login-in"]}`}
        >
          <h1
            className={`${classes["component"]} ${classes["last-component"]}`}
          >
            Login hare
          </h1>
          <div className={classes["component"]}>
            <input
              onChange={onEmailSet}
              onBlur={onEmailSet}
              className={` ${classes["input"]}`}
              type="email"
              name="email"
              placeholder="E-mail"
              value={email}
            />
            <span
              className={`${
                emailIsValid ? classes["valid-msg"] : classes["invalid-msg"]
              }`}
            >
              {emailError}
            </span>
          </div>
          <div
            className={`${classes["component"]} ${classes["last-component"]}`}
          >
            <input
              onChange={onPasswordSet}
              onBlur={onPasswordSet}
              className={`${classes["input"]}`}
              type="password"
              name="password"
              placeholder="Password"
              value={password}
            />
            <span
              className={`${
                passwordIsValid ? classes["valid-msg"] : classes["invalid-msg"]
              }`}
            >
              This is invalid password
            </span>
          </div>
          <button
            onClick={onSubmit}
            className={`${classes["component"]} ${classes["btn"]}`}
          >
            {navigation.state === "submitting" ? "Submitting..." : "Login"}
          </button>
        </div>
      </div>

      <div
        className={`${classes["overlay"]} ${
          registerIsValid && classes["overlay-register-out"]
        } ${!registerIsValid && touched && classes["overlay-login-in"]}`}
      >
        <div
          className={`${classes["to-register"]}
          ${registerIsValid && classes["hide-register-text"]} ${
            !registerIsValid && touched && classes["open-register-text"]
          }`}
        >
          <h2 className={`${classes["overlay-component-header"]}`}>
            Let`s start our journey
          </h2>
          <p className={`${classes["overlay-component-p"]}`}>
            If you don`t have an account yet, join us and start your journey
          </p>
          <Link
            to="?mode=register"
            onClick={registerHandler}
            className={`${classes["overlay-register-btn"]}`}
          >
            Register
          </Link>
        </div>
        <div
          className={`${classes["to-login"]} ${
            registerIsValid && classes["open-login-text"]
          } ${!registerIsValid && touched && classes["hide-login-text"]}`}
        >
          <h2 className={`${classes["overlay-component-header"]}`}>
            Hello friend
          </h2>
          <p className={`${classes["overlay-component-p"]}`}>
            If you already have an account, just login and continue our journey
          </p>
          <Link
            to="?mode=login"
            onClick={loginHandler}
            className={`${classes["overlay-component-btn"]}
            ${classes["overlay-login-btn"]}`}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
