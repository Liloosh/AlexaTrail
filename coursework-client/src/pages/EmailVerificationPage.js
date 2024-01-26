import { useEffect, useState } from "react";
import { useSubmit } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import { useActionData } from "react-router-dom";

const EmailVerificationPage = () => {
  const actionData = useActionData();

  const submit = useSubmit();
  const [email, setEmail] = useState();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (actionData) {
      setMessage(actionData.message);
    }
  }, [actionData]);

  const onInputBlurHandler = (event) => {
    setEmail(event.target.value);
  };

  const onFormSubmit = () => {
    submit({ email }, { method: "POST" });
  };

  return (
    <div className=" bg-gray-500 h-screen w-full pt-40">
      (
      <div className=" w-[25rem] h-fit mx-auto flex flex-col items-center rounded-xl py-5 gap-4 bg-white">
        <h2 className=" text-xl font-bold">Enter your email for confirming</h2>
        <TextField
          onBlur={onInputBlurHandler}
          id="outlined-basic"
          label="Email"
          type="email"
          variant="outlined"
        />
        <Button
          onClick={onFormSubmit}
          size="large"
          variant="outlined"
          color="success"
        >
          Submit
        </Button>
      </div>
      )
      {message === "success" && (
        <div className=" w-[25rem] h-fit mx-auto flex flex-col items-center rounded-xl py-5 gap-4 bg-white">
          <h2>Your email was confirmed</h2>
          <h3>Go to site and log in</h3>
          <Button className=" text-md" variant="outlined" color="info">
            Go to home page
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmailVerificationPage;

export async function action({ request, params }) {
  const verificationToken = params.verificationToken;
  const formData = await request.formData();

  console.log(verificationToken);

  const response = await fetch("https://localhost:7189/api/Auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: formData.get("email"),
      verificationToken: verificationToken,
    }),
  });

  if (response.status == 200) {
    const resData = await response.json();
    return resData;
  }
  const resData = await response.json();
  return resData;
}
