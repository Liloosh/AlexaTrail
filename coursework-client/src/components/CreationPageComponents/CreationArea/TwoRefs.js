import { useState, useContext } from "react";
import AuthContext from "../../../context/AuthContext";
import classes from "./Ref.module.css";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const TwoRefs = (props) => {
  const ctx = useContext(AuthContext);

  const [item1Title, setItem1Title] = useState(props.item1.text);
  const [item1Url, setItem1Url] = useState(props.item1.url);
  const [item1Type, setItem1Type] = useState(props.item1.type);

  const [item2Title, setItem2Title] = useState(props.item2.text);
  const [item2Url, setItem2Url] = useState(props.item2.url);
  const [item2Type, setItem2Type] = useState(props.item2.type);

  const [order, setOrder] = useState(props.item1.order);

  const onFocusElementHandler = () => {
    props.setOrderOfUpdatedElement(order);
  };

  const onChangeTitle1Handler = (event) => {
    setItem1Title(event.target.value);
  };

  const onChangeURL1Handler = (event) => {
    setItem1Url(event.target.value);
  };

  const onChangeType1Handler = (event) => {
    setItem1Type(event.target.value);
  };

  const onChangeTitle2Handler = (event) => {
    setItem2Title(event.target.value);
  };

  const onChangeURL2Handler = (event) => {
    setItem2Url(event.target.value);
  };

  const onChangeType2Handler = (event) => {
    setItem2Type(event.target.value);
  };

  const onCancel = () => {
    props.setOrderOfUpdatedElement(0);
  };

  const onUpdate = () => {
    let items = [
      {
        id: props.item1.id,
        text: item1Title,
        type: item1Type,
        order: order,
        url: item1Url,
      },
      {
        id: props.item2.id,
        text: item2Title,
        type: item2Type,
        order: order,
        url: item2Url,
      },
    ];

    props.updateItems(items, props.item1.refsGroupId);
    props.setOrderOfUpdatedElement(0);
  };

  const onRemoveHandler = () => {
    props.deleteItem(props.item1.id);
  };
  return (
    <div className=" flex flex-col items-center">
      <div
        className="flex w-[29rem] justify-between"
        draggable={props.draggable}
        onDragStart={props.onDragStart}
        onDragLeave={props.onDragLeave}
        onDragEnd={props.onDragEnd}
        onDragOver={props.onDragOver}
        onDrop={props.onDrop}
      >
        <div className=" w-[66%]">
          <div className=" flex py-4">
            <img
              src={
                ctx.icons.find((type) => type.value === item1Type) === undefined
                  ? null
                  : ctx.icons.find((type) => type.value === item1Type).image
              }
              alt=""
              className=" block w-16 mx-4"
            />
            {!props.isElementUpdated ? (
              <h3 className=" self-center w-[33%] mx-[1rem]">{item1Title}</h3>
            ) : (
              <TextField
                label="Title"
                value={item1Title}
                onChange={onChangeTitle1Handler}
              />
            )}
          </div>
          {props.isElementUpdated && (
            <div>
              <div className="flex flex-col h-[11rem] justify-evenly px-4">
                <TextField
                  label="URL"
                  type="text"
                  value={item1Url}
                  onChange={onChangeURL1Handler}
                />
                <FormControl>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    value={item1Type}
                    onChange={onChangeType1Handler}
                  >
                    {ctx.icons.map((item) => {
                      return (
                        <MenuItem value={item.value}>{item.label}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </div>
          )}
          <div className=" flex py-4">
            <img
              src={
                ctx.icons.find((type) => type.value === item2Type) === undefined
                  ? null
                  : ctx.icons.find((type) => type.value === item2Type).image
              }
              alt=""
              className=" block w-16 mx-4"
            />
            {!props.isElementUpdated ? (
              <h3 className=" self-center w-[33%] mx-[1rem]">{item2Title}</h3>
            ) : (
              <TextField
                label="Title"
                value={item2Title}
                onChange={onChangeTitle2Handler}
              />
            )}
          </div>
          {props.isElementUpdated && (
            <div>
              <div className="flex flex-col h-[11rem] justify-evenly px-4">
                <TextField
                  label="URL"
                  type="text"
                  value={item2Url}
                  onChange={onChangeURL2Handler}
                />
                <FormControl>
                  <InputLabel>Type</InputLabel>
                  <Select
                    label="Type"
                    value={item2Type}
                    onChange={onChangeType2Handler}
                  >
                    {ctx.icons.map((item) => {
                      return (
                        <MenuItem value={item.value}>{item.label}</MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col pr-4 w-[28%] items-center justify-evenly">
          <button
            onClick={onRemoveHandler}
            className=" text-white bg-[#ff0000] rounded-2xl px-8 py-2"
          >
            Remove
          </button>
          <button
            onClick={!props.isElementUpdated ? onFocusElementHandler : onUpdate}
            className={
              !props.isElementUpdated
                ? "bg-[#00ffff] rounded-2xl px-8 py-2"
                : "bg-green-500 text-black px-5 py-2 rounded-3xl"
            }
          >
            Update
          </button>
          <button
            onClick={onCancel}
            className={
              props.isElementUpdated
                ? "bg-red-600 text-white px-5 py-2 rounded-3xl"
                : "hidden"
            }
          >
            Cancel
          </button>
        </div>
      </div>
      {props.index !== props.length - 1 && (
        <div className="bg-gray-400 w-[26rem] h-[1px]"></div>
      )}
    </div>
  );
};

export default TwoRefs;
