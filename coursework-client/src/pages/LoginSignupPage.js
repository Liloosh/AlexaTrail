import ReactDOM from "react-dom";
import LoginSignup from "../components/LoginSignup";
import "../App.css";
import { Link, json, redirect } from "react-router-dom";
import { createSession } from "../util/auth";

export function Overlay(props) {
  return <Link to={props.link} className="overlay"></Link>;
}

function LoginSignupPage() {
  return (
    <>
      {ReactDOM.createPortal(
        <Overlay link="/" />,
        document.getElementById("overlay")
      )}
      {ReactDOM.createPortal(<LoginSignup />, document.getElementById("model"))}
    </>
  );
}

export default LoginSignupPage;

export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const formData = await request.formData();
  const mode = searchParams.get("mode");

  let dataForPost = {};

  if (mode === "login") {
    dataForPost = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
  } else if (mode === "register") {
    dataForPost = {
      userName: formData.get("userName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
  }

  const response = await fetch("https://localhost:7189/api/Auth/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataForPost),
  });

  if (response.status === 400 || response.status === 404) {
    const resData = await response.json();
    return resData;
  }

  const resData = await response.json();
  createSession(resData.token);

  return redirect("/" + resData.id);
}
