import { useSubmit, useActionData } from "react-router-dom";
import classes from "./CreationForm.module.css";
import { useEffect, useState } from "react";

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
    setRefsName(event.target.value);
  };

  const onSubmitHandler = () => {
    return submit({ refsName }, { method: "POST" });
  };

  return (
    <div className={classes["container"]}>
      <h2 className={classes["header"]}>Create your ref</h2>
      <div className={classes["input-container"]}>
        <input
          onBlur={onSetRefsName}
          type="text"
          placeholder="Personal ref"
          className={classes["name-input"]}
        ></input>
                {errorMessage && <h3 className={classes["invalid-msg"]}>{errorMessage}</h3>}
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
