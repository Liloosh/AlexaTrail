import { useLoaderData } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import classes from "./PageForUsers.module.css";
import logo from "../assets/AppLogo1.jpg";

const PageForUsers = () => {
  const loaderData = useLoaderData();
  const ctx = useContext(AuthContext);
  return (
    <div className={classes["main-container"]}>
      <div className={classes["refs-container"]}>
        <img className={classes["logo"]} src={logo} />
        {loaderData.map((item, index) => {
          return (
            <>
              <a target="blank" href={item.url}>
                <div className={classes["ref"]} target="blank" href={item.url}>
                  <img
                    src={
                      ctx.icons.find((type) => type.value === item.type).image
                    }
                    alt="ff"
                    className={classes["ref-type"]}
                  />
                  <h3 className={classes["ref-text"]}>{item.text}</h3>
                </div>
              </a>
              {index !== loaderData.length - 1 && (
                <div className={classes["refs-divider"]}></div>
              )}
            </>
          );
        })}
      </div>
    </div>
  );
};

export const loader = async ({ params }) => {
  const name = params.pageGroupName;
  const response = await fetch(
    "https://localhost:7189/api/Ref?refsGroupName=" + name,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (response.ok) {
  }
  const resData = await response.json();

  return resData;
};

export default PageForUsers;
