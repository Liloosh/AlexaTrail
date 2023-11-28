import { useState } from "react";
import logo from "../../assets/AppLogo1.jpg";
import classes from "./CreatedRefsPage.module.css";
import { Link, useSubmit, useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";

function CreatedRefsPage(props) {
  const navigate = useNavigate();
  const submit = useSubmit();
  const [style, setStyle] = useState({
    container: "container",
    update_button: "update-button",
    remove_button: "remove-button",
  });

  const ctx = useContext(AuthContext);

  const onMouseEnterHandler = () => {
    setStyle({
      container: "hovered-container",
      update_button: "update-button",
      remove_button: "remove-button",
    });
  };

  const onMouseLeaveHandler = () => {
    setStyle({
      container: "container",
      update_button: "update-button",
      remove_button: "remove-button",
    });
  };

  const onRemoveHandler = () => {
    let id = props.item.id;
    return submit({ id }, { method: "DELETE" });
  };

  const onUpdateHandler = () => {
    let id = props.item.id;
    ctx.onSetId(id);
    ctx.onSetTitle(props.name)
    navigate("updateRefsGroup")
  };

  return (
    <div
      className={classes[style.container]}
      onMouseEnter={onMouseEnterHandler}
      onMouseLeave={onMouseLeaveHandler}
    >
      <Link to={`${props.item.id}`} className={classes["link"]}>
        <img className={classes["logo"]} src={logo}></img>
        <h2 className={classes["name"]}>{props.name}</h2>
      </Link>
      <button
        className={classes[style.update_button]}
        onClick={onUpdateHandler}
      >
        <h4>Update</h4>
      </button>
      <button
        className={classes[style.remove_button]}
        onClick={onRemoveHandler}
      >
        <h4>Remove</h4>
      </button>
    </div>
  );
}

export default CreatedRefsPage;
