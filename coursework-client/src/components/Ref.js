import React, { useEffect, useState } from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import classes from "./Ref.module.css";
import Select from "react-select";

const Ref = (props) => {
  const ctx = useContext(AuthContext);

  const [Type, setStateType] = useState();
  const [url, setUrl] = useState(props.item.url);
  const [text, setText] = useState(props.item.text);
  const [order, setOrder] = useState(props.item.order);

  const onChangeTitleHandler = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    setOrder(props.item.order);
    setText(props.item.text);
    setUrl(props.item.url);
  }, [props.isElementUpdated]);

  const onChangeURLHandler = (event) => {
    setUrl(event.target.value);
  };

  const onChangeOrderHandler = (event) => {
    setOrder(event.target.value);
  };

  const updateItem = () => {
    if (Type === undefined) {
      props.updateItem(props.item.id, props.item.type, url, text, order);
      props.setOrderOfUpdatedElement(0);
      return;
    }
    props.updateItem(props.item.id, Type.value, url, text, order);
    props.setOrderOfUpdatedElement(0);
  };

  const onFocusElementHandler = () => {
    props.setOrderOfUpdatedElement(order);
  };

  const onRemoveHandler = async () => {
    props.deleteItem(props.item.id);
  };

  const onCancel = () => {
    props.setOrderOfUpdatedElement(0);
  };

  return (
    <div
      className={
        props.index === 0
          ? classes["ref-container"]
          : classes["default-ref-container"]
      }
    >
      <div className={classes["ref"]}>
        <img
          src={
            ctx.icons.find((type) => type.value === props.item.type) ===
            undefined
              ? null
              : ctx.icons.find((type) => type.value === props.item.type).image
          }
          alt=""
          className={classes["ref-type"]}
        />
        {!props.isElementUpdated ? (
          <h3 className={classes["ref-text"]}>{props.item.text}</h3>
        ) : (
          <input
            className={classes["ref-text-input"]}
            value={text}
            onChange={onChangeTitleHandler}
          />
        )}
        <div className={classes["button-section"]}>
          <button
            onClick={onRemoveHandler}
            className={`${classes["btn"]} ${classes["remove-btn"]}`}
          >
            Remove
          </button>
          <button
            onClick={onFocusElementHandler}
            className={
              props.isElementUpdated
                ? classes["update-run"]
                : `${classes["btn"]} ${classes["update-btn"]}`
            }
          >
            Update
          </button>
        </div>
      </div>
      {props.isElementUpdated && (
        <div className={classes["update-section"]}>
          <div className={classes["input-section"]}>
            <h3>URL</h3>
            <input type="text" value={url} onChange={onChangeURLHandler} />
            <h3>Type</h3>
            <Select
              defaultValue={ctx.icons.find(
                (item) => item.value === props.item.type
              )}
              options={ctx.icons}
              onChange={setStateType}
              isSearchable="true"
            />
            <h3>Order</h3>
            <input
              min={1}
              type="number"
              className={classes["order-input"]}
              value={order}
              onChange={onChangeOrderHandler}
            />
          </div>
          <div className={classes["btn-section2"]}>
            <button className={classes["add-btn"]} onClick={updateItem}>
              Update
            </button>
            <button className={classes["cancel-btn"]} onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {props.index !== props.length - 1 && (
        <div className={classes["refs-divider"]}></div>
      )}
    </div>
  );
};

export default Ref;
