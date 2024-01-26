import ReactDOM from "react-dom";
import { Overlay } from "./LoginSignupPage";
import classes from "./UpdateRefsGroup.module.css";
import classes1 from "../components/CreationForm.module.css";
import { useState, useContext, useEffect } from "react";
import { json, redirect, useSubmit, useActionData } from "react-router-dom";
import { TextField } from "@mui/material";
import AuthContext from "../context/AuthContext";

const UpdateForm = () => {
  const ctx = useContext(AuthContext);
  const actionData = useActionData();
  const [errorMessage, setErrorMessage] = useState(null);
  const [refsName, setRefsName] = useState(ctx.refTitle);
  const submit = useSubmit();

  useEffect(() => {
    if (actionData) {
      if (actionData.status === 400) {
        setErrorMessage("RefsGroup with this name is already exist");
        return;
      }
      setErrorMessage(null);
    }
  }, [actionData]);

  const onSetRefsName = (event) => {
    if (event.target.value.length === 25) {
      return;
    } else {
      if (event.target.value == "") {
        setErrorMessage("RefsGroup name can`t be empty");
      } else if (errorMessage == "RefsGroup name can`t be empty") {
        setErrorMessage(null);
      }
      setRefsName(event.target.value);
    }
  };

  const onSubmitHandler = () => {
    if (refsName == null || refsName == "") {
      setErrorMessage("RefsGroup name can`t be empty");
      return;
    }
    const id = ctx.refId;
    return submit({ refsName, id }, { method: "PUT" });
  };

  return (
    <div className={classes["container"]}>
      <h2 className={classes["header"]}>Update your RefsGroup</h2>
      <div className={classes["input-container"]}>
        <TextField
          onChange={onSetRefsName}
          value={refsName}
          type="text"
          label="RefsGroup name"
          variant="outlined"
          className={classes1["name-input"]}
        />
        {errorMessage && (
          <h3 className={classes1["invalid-msg"]}>{errorMessage}</h3>
        )}
      </div>
      <div className={classes["btn-container"]}>
        <button onClick={onSubmitHandler} className={classes["btn"]}>
          Update
        </button>
      </div>
    </div>
  );
};

const UpdateRefsGroup = () => {
  return (
    <>
      {ReactDOM.createPortal(
        <Overlay link=".." />,
        document.getElementById("overlay")
      )}
      {ReactDOM.createPortal(<UpdateForm />, document.getElementById("model"))}
    </>
  );
};

export default UpdateRefsGroup;

export async function action({ request }) {
  const formData = await request.formData();

  if (request.method === "PUT") {
    const response = await fetch(
      "https://localhost:7189/api/RefsGroup/" + formData.get("id"),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(formData.get("refsName")),
      }
    );

    if (response.status === 400) {
      return { status: 400 };
    }
    if (!response.ok) {
      throw json({ message: "Response is not successful" }, { status: 500 });
    }
    return redirect("..");
  }
}
