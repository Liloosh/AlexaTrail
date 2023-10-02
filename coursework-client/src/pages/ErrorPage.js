import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  let title = "An error occurred!";
  let message = error.message;


  return <>
  <h3>{title}</h3>
  <p>{message}</p>
  </>;
}

export default ErrorPage;
