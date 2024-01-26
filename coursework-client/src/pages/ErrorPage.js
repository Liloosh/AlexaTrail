import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "An error occurred!";
  let message = error.message;
  let status = error.status;
  if(error){
    navigate("/")
  }

  return (
    <>
      <h3>{status}</h3>
      <p>{message}</p>
    </>
  );
}

export default ErrorPage;
