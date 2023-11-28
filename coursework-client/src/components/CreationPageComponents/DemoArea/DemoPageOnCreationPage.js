import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../context/AuthContext";
import logo from "../../../assets/AppLogo1.jpg";
import AddOneRefComponent from "./AddOneRefComponent";
import AddFormForDemoPage from "./AddFormForDemoPage";
import AddTwoRefComponent from "./AddTwoRefComponent";
import AddTwoFormsForDemoPage from "./AddTwoFormsToDemoPage";

const DemoPageOnCreationPage = (props) => {
  const ctx = useContext(AuthContext);
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

  return (
    <div className="flex justify-center">
      <div className="h-fit w-fit flex flex-col border-solid border-2 border-sky-500 p-4 rounded-xl gap-2">
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
      <div className=" h-fit w-fit border-solid border-2 border-sky-500 rounded-lg">
        <img className="rounded-t-[1.5rem]" width={396} src={logo} />
        {refsBoard.items.map((item, index) => {
          return item.id === "one-new-element" ? (
            <AddFormForDemoPage onCancelForm={onCancelForm} />
          ) : item.id === "two-new-element" ? (
            <AddTwoFormsForDemoPage onCancelForm={onCancelForm}/>
          ) : item.doubleRef !== true ? (
            <div
              key={index}
              draggable="true"
              onDragStart={(e) => onDragStart(e, refsBoard.id, item)}
              onDragOver={(e) => onDragOver(e, refsBoard.id)}
              onDrop={(e) => onDrop(e, refsBoard.id, item)}
            >
              <div className="flex py-4">
                <img
                  width="56"
                  src={
                    ctx.icons.find((type) => type.value === item.type) ===
                    undefined
                      ? null
                      : ctx.icons.find((type) => type.value === item.type).image
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
              <div className=" flex justify-evenly pt-2">
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
                  <h1 className=" font-sans font-normal text-[1.5rem] self-center">{item.text}</h1>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    width="56"
                    src={
                      ctx.icons.find(
                        (type) => type.value === refsBoard.items[index + 1].type
                      ) === undefined
                        ? null
                        : ctx.icons.find(
                            (type) =>
                              type.value === refsBoard.items[index + 1].type
                          ).image
                    }
                    className=" mx-16 w-16"
                  />
                  <h1 className=" font-sans font-normal text-[1.5rem] self-center">{refsBoard.items[index + 1].text}</h1>
                </div>
              </div>
            )
          );
        })}
      </div>
    </div>
  );
};

export default DemoPageOnCreationPage;
