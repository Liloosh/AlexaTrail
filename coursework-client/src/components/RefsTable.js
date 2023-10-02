import { useContext, useState } from "react";
import classes from "./RefsTable.module.css";
import Select from "react-select";
import AuthContext from "../context/AuthContext";
import { useSubmit } from "react-router-dom";
import Ref from "./Ref";

function RefsTable(props) {
  const ctx = useContext(AuthContext);
  const [style, setStyle] = useState("btn");
  const [Type, setStateType] = useState(-1);
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [order, setOrder] = useState("");

  const [updatedElement, setUpdatedElement] = useState(0);

  const submit = useSubmit();

  const deleteItem = async (refId) => {
    submit({ refId }, { method: "DELETE" });
  };

  const updateItem = async (refId, Type, url, text, order) => {
    submit({ refId, Type, url, text, order }, { method: "PUT" });
  };

  const setOrderOfUpdatedElement = (order) => {
    setUpdatedElement(order);
  };

  const onSetTextHandler = (event) => {
    setText(event.target.value);
  };

  const onSetURLHandler = (event) => {
    setUrl(event.target.value);
  };

  const onSetOrderHandler = (event) => {
    setOrder(event.target.value);
  };
  const onAddHandler = () => {
    setStyle("btn-clicked");
  };

  const onAddRefHandler = () => {
    setStateType(-1);
    setUrl("");
    setText("");
    setOrder("");
    const type = Type.value;
    submit({ type, url, text, order }, { method: "POST" });
  };

  const onCancelClick = () => {
    setStateType(-1);
    setUrl("");
    setText("");
    setOrder("");
    setStyle("btn-clicked-hide");
  };

  return (
    <div className={classes["container"]}>
      <div className={classes["refs-container"]}>
        {props.refsList.map((item, index) => {
          return updatedElement === 0 ? (
            <Ref
              
              isElementUpdated={false}
              setOrderOfUpdatedElement={setOrderOfUpdatedElement}
              updateItem={updateItem}
              deleteItem={deleteItem}
              key={index}
              length={props.refsList.length}
              index={index}
              item={item}
            />
          ) : (
            <Ref
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
          <div className={classes["input-section"]}>
            <h3>Text</h3>
            <input
              type="text"
              value={text}
              onChange={onSetTextHandler}
              onBlur={onSetTextHandler}
            />
            <h3>URL</h3>
            <input
              type="text"
              value={url}
              onChange={onSetURLHandler}
              onBlur={onSetURLHandler}
            />
            <h3>Type</h3>
            <Select
              value={Type}
              options={ctx.icons}
              onChange={setStateType}
              isSearchable="true"
            />
            <h3>Order</h3>
            <input
              min={1}
              value={order}
              onChange={onSetOrderHandler}
              onBlur={onSetOrderHandler}
              type="number"
              className={classes["order-input"]}
            />
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
