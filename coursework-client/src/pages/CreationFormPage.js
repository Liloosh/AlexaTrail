import { Overlay } from "./LoginSignupPage";
import ReactDOM from "react-dom";
import CreationForm from "../components/CreationForm";
import { getUserId } from "../util/auth";
import { redirect, json } from "react-router-dom";

function CreationFormPage() {
  return (
    <>
      {ReactDOM.createPortal(
        <Overlay link=".." />,
        document.getElementById("overlay")
      )}
      {ReactDOM.createPortal(
        <CreationForm />,
        document.getElementById("model")
      )}
    </>
  );
}

export default CreationFormPage;

export async function action({ request, params }) {
  const userId = params.userId;
  const formData = await request.formData();

  const response = await fetch("https://localhost:7189/api/RefsGroup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formData.get("refsName"),
      userId: userId,
    }),
  });

  if (response.status === 400) {
    return { status: 400 };
  }
  if (!response.ok) {
    throw json({ message: "Response is not successful" }, { status: 500 });
  }

  return redirect("/" + userId);
}
