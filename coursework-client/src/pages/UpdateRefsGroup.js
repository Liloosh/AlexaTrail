import ReactDOM from "react-dom";
import { Overlay } from "./LoginSignupPage";
import classes from "./UpdateRefsGroup.module.css";
import { useState, useContext } from "react";
import { redirect, useSubmit } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const UpdateForm = () => {
  const ctx = useContext(AuthContext);
  const [refsName, setRefsName] = useState(ctx.refTitle);
  const submit = useSubmit();

  const onSetRefsName = (event) => {
    setRefsName(event.target.value);
  };

  const onSubmitHandler = () => {
    const id = ctx.refId;
    return submit({ refsName, id }, { method: "PUT" });
  };

  return (
    <div className={classes["container"]}>
      <h2 className={classes["header"]}>Update your ref</h2>
      <div className={classes["input-container"]}>
        <input
          value={refsName}
          onChange={onSetRefsName}
          type="text"
          placeholder="Personal ref"
          className={classes["name-input"]}
        ></input>
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData.get("refsName")),
      }
    );
    return redirect("..");
  }
}
