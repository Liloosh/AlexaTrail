import { useContext, useState } from "react";
import classes from "./RefsTable.module.css";
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
  const [Type, setStateType] = useState();
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [order, setOrder] = useState("");

  let list = props.refsList;
  const [listOfItems, setListOfItems] = useState(props.refsList);

  const [firstDraggedElement, setFirstDraggedElement] = useState();

  const [updatedElement, setUpdatedElement] = useState(0);

  const submit = useSubmit();

  const deleteItem = async (refId) => {
    submit({ refId }, { method: "DELETE" });
  };

  const updateDoubleItem = async (items, refGroupId) => {
    items = JSON.stringify(items);
    submit({ items,  refGroupId}, { method: "PATCH" });
  };

  const updateItem = async (refGroupId, refId, Type, url, text, order) => {
    submit({refGroupId, refId, Type, url, text, order }, { method: "PATCH" });
  };

  const setOrderOfUpdatedElement = (order) => {
    setUpdatedElement(order);
  };

  const onSetTextHandler = (event) => {
    setText(event.target.value);
  };

  const onSetTypeHandler = (event) => {
    setStateType(event.target.value);
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
    const type = Type;
    submit({ type, url, text, order }, { method: "POST" });
    setStateType("");
    setUrl("");
    setText("");
    setOrder("");
  };

  const onCancelClick = () => {
    setStateType(-1);
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
          return updatedElement === 0 ? (
            item.doubleRef && props.refsList[index + 1].order === item.order ? (
              <TwoRefs
                updateItems={updateDoubleItem}
                isElementUpdated={false}
                setOrderOfUpdatedElement={setOrderOfUpdatedElement}
                item1={item}
                item2={props.refsList[index + 1]}
              />
            ) : props.refsList[index - 1].order !== item.order ? (
              <Ref
                draggable={true}
                onDragStart={(e) => onDragStart(e, item)}
                onDragLeave={(e) => onDragLeave(e)}
                onDragEnd={(e) => onDragEnd(e)}
                onDragOver={(e) => onDragOver(e)}
                onDrop={(e) => onDrop(e, item)}
                isElementUpdated={false}
                setOrderOfUpdatedElement={setOrderOfUpdatedElement}
                updateItem={updateItem}
                deleteItem={deleteItem}
                key={index}
                length={props.refsList.length}
                index={index}
                item={item}
              />
            ) : null
          ) : item.doubleRef &&
            props.refsList[index + 1].order === item.order ? (
            <TwoRefs
              updateItems={updateDoubleItem}
              isElementUpdated={updatedElement === item.order ? true : false}
              setOrderOfUpdatedElement={setOrderOfUpdatedElement}
              item1={item}
              item2={props.refsList[index + 1]}
            />
          ) : props.refsList[index - 1].order !== item.order ? (
            <Ref
              draggable={true}
              onDragStart={(e) => onDragStart(e, item)}
              onDragLeave={(e) => onDragLeave(e)}
              onDragEnd={(e) => onDragEnd(e)}
              onDragOver={(e) => onDragOver}
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
          ) : null;
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
            <TextField
              label="Title"
              type="text"
              value={text}
              onChange={onSetTextHandler}
              onBlur={onSetTextHandler}
            />
            <TextField
              label="URL"
              type="text"
              value={url}
              onChange={onSetURLHandler}
              onBlur={onSetURLHandler}
            />
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
            </FormControl>
            <TextField
              label="Order"
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
