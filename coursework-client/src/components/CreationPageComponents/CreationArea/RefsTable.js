import { useContext, useState } from "react";
import classes from "./RefsTable.module.css";
import classes1 from "../../CreationForm.module.css";
import AuthContext from "../../../context/AuthContext";
import { useSubmit } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import Ref from "./Ref";
import TwoRefs from "./TwoRefs";

function RefsTable(props) {
  const ctx = useContext(AuthContext);
  const [style, setStyle] = useState("btn");
  const [Type, setStateType] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [order, setOrder] = useState("");

  let list = props.refsList;

  const [firstDraggedElement, setFirstDraggedElement] = useState();
  const [updatedElement, setUpdatedElement] = useState(0);

  const [errorTitle, setErrorTitle] = useState();
  const [errorUrl, setErrorUrl] = useState();
  const [errorType, setErrorType] = useState();
  const [errorOrder, setErrorOrder] = useState();

  const submit = useSubmit();

  const deleteItem = async (refId) => {
    submit({ refId }, { method: "DELETE" });
  };

  const updateDoubleItem = async (items, refGroupId) => {
    items = JSON.stringify(items);
    submit({ items, refGroupId }, { method: "PATCH" });
  };

  const updateItem = async (refGroupId, refId, Type, url, text, order) => {
    submit({ refGroupId, refId, Type, url, text, order }, { method: "PATCH" });
  };

  const setOrderOfUpdatedElement = (order) => {
    setUpdatedElement(order);
  };

  const onSetTextHandler = (event) => {
    if (event.target.value.length === 25) {
      setErrorTitle("Title can`t be more then 25 chars");
      return;
    } else {
      if (event.target.value == "") {
        setErrorTitle("Title can`t be empty");
      } else if (errorTitle !== null) {
        setErrorTitle(null);
      }
      setText(event.target.value);
    }
  };

  const onSetTypeHandler = (event) => {
    setErrorType(null);
    setStateType(event.target.value);
  };

  const onSetURLHandler = (event) => {
    if (event.target.value == "") {
      setErrorUrl("Url can`t be empty");
    } else if (event.target.value.slice(0, 8) !== "https://") {
      setErrorUrl("It is not url");
    } else if (errorUrl != null) {
      setErrorUrl(null);
    }
    setUrl(event.target.value);
  };

  const onSetOrderHandler = (event) => {
    if (event.target.value == "") {
      setErrorOrder("Order can`t be empty");
    } else if (event.target.value < 1) {
      setErrorOrder("Order can`t be less then 1");
      return;
    } else if (errorOrder != null) {
      setErrorOrder(null);
    }
    setOrder(event.target.value);
  };

  const onAddHandler = () => {
    setStyle("btn-clicked");
  };

  const onAddRefHandler = () => {
    const type = Type;
    if (!errorTitle && !errorUrl && !errorType && !errorOrder) {
      if (text == "" || order == "" || url == "" || type == "") {
        if (text == "") {
          setErrorTitle("Title can`t be empty");
        }
        if (order == "") {
          setErrorOrder("Order can`t be empty");
        }
        if (url == "") {
          setErrorUrl("Url can`t be empty");
        }
        if (type == "") {
          setErrorType("Type can`t be empty");
        }
        return;
      }
      submit({ type, url, text, order }, { method: "POST" });
      setStateType("");
      setUrl("");
      setText("");
      setOrder("");
    }
  };

  const onCancelClick = () => {
    setErrorTitle(null);
    setErrorType(null);
    setErrorUrl(null);
    setErrorOrder(null);
    setStateType("");
    setUrl("");
    setText("");
    setOrder("");
    setStyle("btn-clicked-hide");
  };

  const onDragStart = (e, item) => {
    setFirstDraggedElement(item);
    console.log(list);
  };

  const onDragLeave = (e) => {};

  const onDragEnd = (e) => {};

  const onDragOver = (e) => {
    e.preventDefault();
    console.log("over");
  };

  const onDrop = (e, item) => {
    e.preventDefault();
    if (firstDraggedElement.order < item.order) {
      for (let i = firstDraggedElement.order; i < item.order; i++) {
        list[i].order = i;
      }
      list[firstDraggedElement.order - 1].order = item.order + 1;
      list.forEach((element) => {
        delete element.refsGroup;
        delete element.refsGroupId;
      });
      console.log(list);
      list = JSON.stringify(list);
      submit({ list: list }, { method: "PUT" });
    } else if (firstDraggedElement.order > item.order) {
      for (let i = item.order - 1; i < firstDraggedElement.order - 1; i++) {
        list[i].order = list[i].order + 1;
      }
      list[firstDraggedElement.order - 1].order = item.order - 1;
      list.forEach((element) => {
        delete element.refsGroup;
        delete element.refsGroupId;
      });
      console.log(list);
      list = JSON.stringify(list);
      submit({ list: list }, { method: "PUT" });
    } else {
      return;
    }
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["refs-container"]}>
        {props.refsList.map((item, index) => {
          return item.doubleRef ? (
            props.refsList[index + 1].order === item.order ? (
              <TwoRefs
                updateItems={updateDoubleItem}
                deleteItem={deleteItem}
                isElementUpdated={updatedElement === item.order ? true : false}
                setOrderOfUpdatedElement={setOrderOfUpdatedElement}
                item1={item}
                item2={props.refsList[index + 1]}
              />
            ) : null
          ) : (
            <Ref
              draggable={true}
              onDragStart={(e) => onDragStart(e, item)}
              onDragLeave={(e) => onDragLeave(e)}
              onDragEnd={(e) => onDragEnd(e)}
              onDragOver={(e) => onDragOver(e)}
              onDrop={(e) => onDrop(e, item)}
              isElementUpdated={updatedElement === item.order ? true : false}
              setOrderOfUpdatedElement={setOrderOfUpdatedElement}
              updateItem={updateItem}
              deleteItem={deleteItem}
              key={index}
              length={props.refsList.length}
              index={index}
              item={item}
            />
          );
        })}
      </div>
      {style === "btn-clicked" || style === "btn-clicked-hide" ? (
        <div
          className={
            style === "btn-clicked-hide"
              ? classes["add-container-hide"]
              : classes["add-container"]
          }
        >
          <div className={`${classes["input-section"]} gap-4`}>
            <div>
              <TextField
                label="Title"
                type="text"
                value={text}
                className=" mt-4"
                onChange={onSetTextHandler}
                onBlur={onSetTextHandler}
              />
              {errorTitle && (
                <h3 className={classes["invalid-msg"]}>{errorTitle}</h3>
              )}
            </div>
            <div>
              <TextField
                label="URL"
                type="text"
                value={url}
                onChange={onSetURLHandler}
                onBlur={onSetURLHandler}
              />
              {errorUrl && (
                <h3 className={classes["invalid-msg"]}>{errorUrl}</h3>
              )}
            </div>
            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                labelId="select-label"
                label="Type"
                value={Type}
                onChange={onSetTypeHandler}
              >
                {ctx.icons.map((item) => {
                  return <MenuItem value={item.value}>{item.label}</MenuItem>;
                })}
              </Select>
              {errorType && (
                <h3 className={classes["invalid-msg"]}>{errorType}</h3>
              )}
            </FormControl>
            <div>
              <TextField
                label="Order"
                min={1}
                value={order}
                onChange={onSetOrderHandler}
                onBlur={onSetOrderHandler}
                type="number"
                className={
                  !errorOrder
                    ? `mb-4 ${classes["order-input"]}`
                    : classes["order-input"]
                }
              />
              {errorOrder && (
                <h3 className={`mb-4 ${classes["invalid-msg"]}`}>
                  {errorOrder}
                </h3>
              )}
            </div>
          </div>
          <div className={classes["btn-section"]}>
            <button className={classes["add-btn"]} onClick={onAddRefHandler}>
              Add
            </button>
            <button className={classes["cancel-btn"]} onClick={onCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className={classes["add-container-hided"]}> </div>
      )}
      <div onClick={onAddHandler} className={classes[style]}>
        Add new ref
      </div>
    </div>
  );
}

export default RefsTable;
