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

const AddFormForDemoPage = (props) => {
  const submit = useSubmit();
  const ctx = useContext(AuthContext);
  const [type, setType] = useState("");
  const [text, setText] = useState();
  const [url, setUrl] = useState();
  const [order, setOrder] = useState();

  const onCreateRefHandler = () => {
    setUrl("");
    setText("");
    setOrder("");
    submit({ type, url, text, order }, { method: "POST" });
  };

  const onCancelForm = () => {
    props.onCancelForm();
  };

  const onSetTextHandler = (event) => {
    setText(event.target.value);
  };

  const onSetUrlHandler = (event) => {
    setUrl(event.target.value);
  };

  const onSetOrderHandler = (event) => {
    setOrder(event.target.value);
  };

  const onSetTypeHandler = (event) => {
    setType(event.target.value);
  };
  return (
    <div className="h-full w-full flex flex-col gap-4 border-8 border-solid border-main-color rounded-xl rounded-t-none p-2">
      <h1 className=" text-lg font-bold text-center p-1">New ref</h1>
      <TextField onChange={onSetTextHandler} label="Title" />
      <TextField onChange={onSetUrlHandler} label="URL" />
      <div className=" flex justify-between">
        <FormControl className=" w-[10rem]">
          <InputLabel>Type</InputLabel>
          <Select label="Type" value={type} onChange={onSetTypeHandler}>
            {ctx.icons.map((item) => {
              return <MenuItem value={item.value}>{item.label}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <TextField
          onChange={onSetOrderHandler}
          label="Order"
          type="number"
          className=" w-[10ch]"
        />
      </div>
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

export default AddFormForDemoPage;
