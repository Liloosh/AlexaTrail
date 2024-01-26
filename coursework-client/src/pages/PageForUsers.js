import { useLoaderData } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import classes from "./PageForUsers.module.css";
import logo from "../assets/AppLogo1.jpg";

const PageForUsers = () => {
  const loaderData = useLoaderData();
  const [refsList, setRefsList] = useState(loaderData.resData);
  const [myImage, setImage] = useState(loaderData.image);
  const ctx = useContext(AuthContext);
  return (
    <div className={classes["main-container"]}>
      <div className={classes["refs-container"]}>
        <img
          className={classes["logo"]}
          src={
            myImage.image == null
              ? logo
              : `data:image/jpeg;base64,${myImage.image}`
          }
        />
        {refsList.map((item, index) => {
          return (
            <>
              {item.doubleRef !== true ? (
                <>
                  <a target="blank" href={item.url}>
                    <div
                      className={classes["ref"]}
                      target="blank"
                      href={item.url}
                    >
                      <img
                        src={
                          ctx.icons.find((type) => type.value === item.type)
                            .image
                        }
                        alt="ff"
                        className={classes["ref-type"]}
                      />
                      <h3 className={classes["ref-text"]}>{item.text}</h3>
                    </div>
                  </a>
                  {index !== refsList.length - 1 && (
                    <div className={classes["refs-divider"]}></div>
                  )}
                </>
              ) : (
                item.orderInRef != 2 && (
                  <>
                    <div
                      key={index}
                      className=" flex justify-evenly pt-2 bg-white rounded-b-xl"
                    >
                      <a
                      target="blank"
                      href={item.url} className=" flex flex-col items-center">
                        <img
                          width="56"
                          src={
                            ctx.icons.find(
                              (type) => type.value === item.type
                            ) === undefined
                              ? null
                              : ctx.icons.find(
                                  (type) => type.value === item.type
                                ).image
                          }
                          className=" mx-16 w-16"
                        />
                        <h1 className=" font-sans font-normal text-[1.5rem] self-center">
                          {item.text}
                        </h1>
                      </a>
                      <a
                      target="blank"
                      href={refsList[index + 1].url} className="flex flex-col items-center">
                        <img
                          width="56"
                          src={
                            ctx.icons.find(
                              (type) => type.value === refsList[index + 1].type
                            ) === undefined
                              ? null
                              : ctx.icons.find(
                                  (type) =>
                                    type.value === refsList[index + 1].type
                                ).image
                          }
                          className=" mx-16 w-16"
                        />
                        <h1 className=" font-sans font-normal text-[1.5rem] self-center">
                          {refsList[index + 1].text}
                        </h1>
                      </a>
                    </div>
                    {index !== refsList.length - 1 && (
                    <div className={classes["refs-divider"]}></div>
                  )}
                  </>
                )
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
    "https://localhost:7189/api/Ref/nameRefGroup?name=" + name,
    {
      method: "GET",
      headers: { "Content-Type": "application/json",
      "Authorization" :"Bearer " + localStorage.getItem("token") },
    }
  );

  const response3 = await fetch(
    "https://localhost:7189/api/RefsGroup/getImageByName?name=" + name,
    { method: "GET", headers: {
      "Authorization" :"Bearer " + localStorage.getItem("token")
    } }
  );

  const resData = await response.json();
  const image = await response3.json();

  return { resData, image };
};

export default PageForUsers;
