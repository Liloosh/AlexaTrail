import React, { useState } from "react";
import facebook from "../assets/RefTypes/facebook.svg";
import telegram from "../assets/RefTypes/telegram.svg";
import instagram from "../assets/RefTypes/instagram.svg";
import youtube from "../assets/RefTypes/youtube.svg";
import twitter from "../assets/RefTypes/twitter.svg";

const AuthContext = React.createContext({
  userName: "",
  onSetUserName: (name) => {},
  icons: [],
  refId: "",
  refTitle: "",
  onSetId: (id) => {},
  onSetTitle: (title) => {},
});

export const AuthContextProvider = (props) => {
  const [userName, setUserName] = useState(null);
  const [id, setId] = useState();
  const [title, setTitle] = useState();

  const SetUserName = (name) => {
    setUserName(name);
  };

  const SetId = (id) => {
    setId(id);
  };

  const SetTitle = (title) => {
    setTitle(title);
  };

  const user = {
    userName: userName,
    onSetUserName: SetUserName,
    icons: [
      { value: "facebook", label: "Facebook", image: facebook },
      { value: "telegram", label: "Telegram", image: telegram },
      { value: "instagram", label: "Instagram", image: instagram },
      { value: "youtube", label: "Youtube", image: youtube },
      { value: "twitter", label: "Twitter", image: twitter },
    ],
    refId: id,
    refTitle: title,
    onSetId: SetId,
    onSetTitle: SetTitle,
  };

  return (
    <AuthContext.Provider value={user}>{props.children}</AuthContext.Provider>
  );
};

export default AuthContext;
