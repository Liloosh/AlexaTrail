import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useContext, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import { useSubmit } from "react-router-dom";

const AddTwoFormsForDemoPage = (props) => {
  const ctx = useContext(AuthContext);
  const submit = useSubmit();

  const [createdRef, setCreatedRef] = useState(1);

  const [type1, setType1] = useState("");
  const [text1, setText1] = useState();
  const [url1, setUrl1] = useState();
  const [order, setOrder] = useState();

  const [type2, setType2] = useState("");
  const [text2, setText2] = useState();
  const [url2, setUrl2] = useState();

  const onCreateRefHandler = () => {
    setUrl1("");
    setText1("");
    submit(
      { type1, url1, text1, order, type2, url2, text2 },
      { method: "POST" }
    );
  };

  const onCancelForm = () => {
    props.onCancelForm();
  };

  const onSetText1Handler = (event) => {
    setText1(event.target.value);
  };

  const onSetText2Handler = (event) => {
    setText2(event.target.value);
  };

  const onSetUrl1Handler = (event) => {
    setUrl1(event.target.value);
  };

  const onSetUrl2Handler = (event) => {
    setUrl2(event.target.value);
  };

  const onSetOrderHandler = (event) => {
    setOrder(event.target.value);
  };

  const onSetType1Handler = (event) => {
    setType1(event.target.value);
  };

  const onSetType2Handler = (event) => {
    setType2(event.target.value);
  };

  const onGoToSecond = () => {
    setCreatedRef(2);
  };

  const onGoToFirst = () => {
    setCreatedRef(1);
  };

  return (
    <div className="flex flex-col gap-4 border-8 border-solid border-main-color rounded-xl rounded-t-none p-2">
      <div
        className={createdRef == 1 ? "h-full w-full flex  gap-4 " : "hidden"}
      >
        <div className=" w-[90%] flex flex-col gap-2">
          <h1 className=" text-lg font-bold text-center p-1">New ref</h1>
          <TextField onChange={onSetText1Handler} label="Title" />
          <TextField onChange={onSetUrl1Handler} label="URL" />
          <div className=" flex justify-between">
            <FormControl className=" w-[10rem]">
              <InputLabel>Type</InputLabel>
              <Select label="Type" value={type1} onChange={onSetType1Handler}>
                {ctx.icons.map((item) => {
                  return <MenuItem value={item.value}>{item.label}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className=" w-[20%] bg-slate-600 flex justify-center items-center">
          <button onClick={onGoToSecond} className=" text-white text-lg">
            -{">"}
          </button>
        </div>
      </div>
      <div
        className={createdRef == 2 ? "h-full w-full flex  gap-4 " : "hidden"}
      >
        <div className=" w-[20%] bg-slate-600 flex justify-center items-center">
          <button onClick={onGoToFirst} className=" text-white text-lg">
            {"<"}-
          </button>
        </div>
        <div className=" w-[90%] flex flex-col gap-2">
          <h1 className=" text-lg font-bold text-center p-1">New ref</h1>
          <TextField onChange={onSetText2Handler} label="Title" />
          <TextField onChange={onSetUrl2Handler} label="URL" />
          <div className=" flex justify-between">
            <FormControl className=" w-[10rem]">
              <InputLabel>Type</InputLabel>
              <Select label="Type" value={type2} onChange={onSetType2Handler}>
                {ctx.icons.map((item) => {
                  return <MenuItem value={item.value}>{item.label}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
      <TextField
        onChange={onSetOrderHandler}
        label="Order"
        type="number"
        className=" w-[10ch]"
      />
      <div className=" w-full flex justify-between">
        <Button
          className=" font-bold text-base w-[45%]"
          variant="outlined"
          color="success"
          onClick={onCreateRefHandler}
        >
          Create
        </Button>
        <Button
          className="font-bold text-base w-[45%]"
          variant="outlined"
          color="error"
          onClick={onCancelForm}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddTwoFormsForDemoPage;
