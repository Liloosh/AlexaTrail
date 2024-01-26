import { useSubmit, useActionData } from "react-router-dom";
import classes from "./CreationForm.module.css";
import { useEffect, useState } from "react";
import { TextField } from "@mui/material";

function CreationForm() {
  const [errorMessage, setErrorMessage] = useState(null);
  const actionData = useActionData();
  const [refsName, setRefsName] = useState();
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
    return submit({ refsName }, { method: "POST" });
  };

  return (
    <div className={classes["container"]}>
      <h2 className={classes["header"]}>Create your RefsGroup</h2>
      <div className={classes["input-container"]}>
        <TextField
          onChange={onSetRefsName}
          value={refsName}
          type="text"
          label="RefsGroup name"
          variant="outlined"
          className={classes["name-input"]}
        />
        {errorMessage && (
          <h3 className={classes["invalid-msg"]}>{errorMessage}</h3>
        )}
      </div>
      <div className={classes["btn-container"]}>
        <button onClick={onSubmitHandler} className={classes["btn"]}>
          Create
        </button>
      </div>
    </div>
  );
}

export default CreationForm;
