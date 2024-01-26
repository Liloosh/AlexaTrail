import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import logo from "../../../assets/AppLogo1.jpg";
import AddOneRefComponent from "./AddOneRefComponent";
import AddFormForDemoPage from "./AddFormForDemoPage";
import AddTwoRefComponent from "./AddTwoRefComponent";
import AddTwoFormsForDemoPage from "./AddTwoFormsToDemoPage";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useSubmit, useParams } from "react-router-dom";
import { Button } from "@mui/material";

const DemoPageOnCreationPage = (props) => {
  const params = useParams();
  const submit = useSubmit();
  const ctx = useContext(AuthContext);
  const [dragContainerIsActive, setDragContainerIsActive] = useState(false);
  const [myImage, setImage] = useState(props.image);
  const [myImage2, setImage2] = useState(null);
  const [refsBoard, addRefToBorder] = useState({
    id: "refs-board",
    items: props.refsList,
  });
  const addBoard = {
    id: "add-board",
    items: [
      { id: "add-one-ref", view: "add-one-ref-component" },
      { id: "add-two-ref", view: "add-two-ref-component" },
    ],
  };
  const [druggedElement, setDraggedElement] = useState();

  useEffect(() => {
    addRefToBorder({
      id: "refs-board",
      items: props.refsList,
    });
  }, [props.refsList]);
  const onDragStart = (e, boardId, item) => {
    console.log(boardId);
    setDraggedElement({ boardId, item });
  };

  const onDragOver = (e, boardId) => {
    e.preventDefault();
    if (boardId === "refs-board") {
      console.log(1);
    }
  };

  const onDrop = (e, boardId, item) => {
    e.preventDefault();
    console.log(druggedElement.boardId);
    console.log(boardId);
    switch (druggedElement.boardId) {
      case boardId:
        break;
      case "refs-board":
        break;
      case "add-board":
        console.log(1);
        if (druggedElement.item.id === "add-one-ref") {
          addRefToBorder((past) => {
            return {
              id: past.id,
              items: [{ id: "one-new-element" }, ...past.items],
            };
          });
        } else if (druggedElement.item.id === "add-two-ref") {
          addRefToBorder((past) => {
            return {
              id: past.id,
              items: [{ id: "two-new-element" }, ...past.items],
            };
          });
        }
        break;
    }
  };

  const onCancelForm = () => {
    addRefToBorder({
      id: "refs-board",
      items: props.refsList,
    });
  };

  const onDragContainerHandler = () => {
    setDragContainerIsActive(!dragContainerIsActive);
  };

  const onImageChange = async (e) => {
    if (e.target.files[0] !== undefined) {
      const refsGroupId = params.refsPageId;
      const mmyImage = new FormData();
      mmyImage.append("myImage", e.target.files[0]);
      const response = await fetch(
        "https://localhost:7189/api/RefsGroup/setImage/" + refsGroupId,
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: mmyImage,
        }
      );
      const data = new Response(JSON.stringify(e.target.files[0]));
      if ("caches" in window) {
        let cache = await caches.open("MyImage");
        cache.put("https://localhost:3000/", data);
      }
      setImage2(e.target.files[0]);
    }
  };

  return (
    <div className="w-fit mx-auto relative flex max-tablet:flex-col justify-center">
      <div
        onClick={onDragContainerHandler}
        className={`  ${
          dragContainerIsActive
            ? "flex h-fit tablet:absolute left-[-48%]"
            : "flex h-fit tablet:absolute left-[-1.8rem]"
        }`}
      >
        <div className=" bg-gray-400 rounded-l-2xl px-1 flex items-center max-tablet:hidden">
          {dragContainerIsActive ? (
            <ArrowForwardIosIcon fontSize="small" />
          ) : (
            <ArrowBackIosNewIcon fontSize="small" />
          )}
        </div>
        <div className="h-f it w-fit flex tablet:flex-col max-tablet:w-full max-tablet:justify-evenly max-tablet:rounded-t-xl border-solid border-2 border-gray-400 p-4  gap-2">
          {addBoard.items.map((item) => {
            return item.view === "add-one-ref-component" ? (
              <AddOneRefComponent
                draggable="true"
                onDragOver={(e) => onDragOver(e, addBoard.id)}
                onDragStart={(e) => onDragStart(e, addBoard.id, item)}
                onDrop={(e) => onDrop(e, addBoard.id, item)}
              />
            ) : (
              <AddTwoRefComponent
                draggable="true"
                onDragOver={(e) => onDragOver(e, addBoard.id)}
                onDragStart={(e) => onDragStart(e, addBoard.id, item)}
                onDrop={(e) => onDrop(e, addBoard.id, item)}
              />
            );
          })}
        </div>
      </div>
      <div className=" z-10 h-fit w-fit ">
        <input
          className="hidden"
          id="select-new-image"
          type="file"
          onChange={onImageChange}
        />
        <div className="relative">
          <div className=" bg-[#90caf9]  w-fit h-fit absolute bottom-0 right-0 rounded-md rounded-br-none">
            <Button
              variant="contained"
              className="  font-bold text-black rounded-md rounded-br-none "
              onClick={() =>
                document.getElementById("select-new-image").click()
              }
            >
              Change image
            </Button>
          </div>
          <img
            className="rounded-tr-[1.5rem] max-tablet:rounded-none"
            width={396}
            src={
              myImage2 == null
                ? myImage == null
                  ? logo
                  : `data:image/jpeg;base64,${myImage.image}`
                : URL.createObjectURL(myImage2)
            }
            draggable={false}
          />
        </div>
        <div className="border-solid border-4 border-main-color rounded-b-2xl">
          {refsBoard.items.map((item, index) => {
            return item.id === "one-new-element" ? (
              <AddFormForDemoPage onCancelForm={onCancelForm} />
            ) : item.id === "two-new-element" ? (
              <AddTwoFormsForDemoPage onCancelForm={onCancelForm} />
            ) : item.doubleRef !== true ? (
              <div
                draggable="true"
                onDragStart={(e) => onDragStart(e, refsBoard.id, item)}
                onDragOver={(e) => onDragOver(e, refsBoard.id)}
                onDrop={(e) => onDrop(e, refsBoard.id, item)}
                className=" bg-white rounded-b-xl"
                key={index}
              >
                <div className="flex py-4">
                  <img
                    width="56"
                    src={
                      ctx.icons.find((type) => type.value === item.type) ===
                      undefined
                        ? null
                        : ctx.icons.find((type) => type.value === item.type)
                            .image
                    }
                    className=" mx-16 w-16"
                  />
                  <h2 className=" font-sans font-normal text-[2rem] self-center">
                    {item.text}
                  </h2>
                </div>
                {index !== props.refsList.length - 1 && (
                  <div className="bg-gray-500 w-[26rem] h-[0.1rem] mx-auto"></div>
                )}
              </div>
            ) : (
              item.orderInRef != 2 && (
                <>
                  <div
                    key={index}
                    draggable="true"
                    onDragStart={(e) => onDragStart(e, refsBoard.id, item)}
                    onDragOver={(e) => onDragOver(e, refsBoard.id)}
                    onDrop={(e) => onDrop(e, refsBoard.id, item)}
                    className=" flex justify-evenly pt-2 bg-white rounded-b-xl"
                  >
                    <div className=" flex flex-col items-center">
                      <img
                        width="56"
                        src={
                          ctx.icons.find((type) => type.value === item.type) ===
                          undefined
                            ? null
                            : ctx.icons.find((type) => type.value === item.type)
                                .image
                        }
                        className=" mx-16 w-16"
                      />
                      <h1 className=" font-sans font-normal text-[1.5rem] self-center">
                        {item.text}
                      </h1>
                    </div>
                    <div className="flex flex-col items-center">
                      <img
                        width="56"
                        src={
                          ctx.icons.find(
                            (type) =>
                              type.value === refsBoard.items[index + 1].type
                          ) === undefined
                            ? null
                            : ctx.icons.find(
                                (type) =>
                                  type.value === refsBoard.items[index + 1].type
                              ).image
                        }
                        className=" mx-16 w-16"
                      />
                      <h1 className=" font-sans font-normal text-[1.5rem] self-center">
                        {refsBoard.items[index + 1].text}
                      </h1>
                    </div>
                  </div>
                  {index !== props.refsList.length - 1 && (
                    <div className="bg-gray-500 w-[26rem] h-[0.1rem] mx-auto"></div>
                  )}
                </>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DemoPageOnCreationPage;
