import { Link, redirect, useLoaderData } from "react-router-dom";
import CreatedRefsPage from "../components/CreatedRefsPage";
import classes from "./HomePage.module.css";
import { getUserId } from "../util/auth";

function HomePage() {
  const loaderData = useLoaderData();
  return (
    <div className={classes["page-container"]}>
      <div className={classes["refsPages-container"]}>
        {loaderData.map((item, index) => {
          return (
            <div key={index} className={classes["refsPages"]}>
              <CreatedRefsPage item={item} name={item.name} />
            </div>
          );
        })}
      </div>
      <div className={classes["create-btn-container"]}>
        <Link className={classes["create-btn"]} to="creation">
          Create new refs page
        </Link>
      </div>
    </div>
  );
}

export default HomePage;

export async function loader({params}) {
  const userId = params.userId;
  const response = await fetch("https://localhost:7189/api/RefsGroup/" + userId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = response.json();

  return resData;
}

export async function action({request, params}) {
  const formData = await request.formData();
  const id = formData.get("id");
  const response = await fetch("https://localhost:7189/api/RefsGroup/" + id, {method: "DELETE"})
  return redirect(`/${params.userId}`)
}
