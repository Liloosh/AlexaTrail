import { useSpring, animated } from "react-spring";
import { Link } from "react-router-dom";
import { useState } from "react";
import finalPage from "../assets/finalPage.png";
import classes from "./StartPage.module.css";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

function StartPage() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    console.log(position);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const { webkitScrollbar } = useSpring({
    
  });
  return (
    <Parallax pages={4} className={classes["example"]}>
      <ParallaxLayer offset={0} factor={2} speed={0.5}>
        <div className=" min-h-screen  bg-[#d4d4b5] ">
          <div className="flex max-lg:flex-col-reverse items-center justify-center gap-20 h-fit pt-10">
            <img className={`m-4 w-[25rem] h-fit`} src={finalPage} />
            <div>
              <h1 className=" font-bold text-8xl max-w-[45rem] text-[#13213c]">
                Everything you want to share in one simple link.
              </h1>
              <div className=" flex mt-10 items-center gap-4">
                <h2 className="font-bold text-4xl text-[#13213c]">
                  Get start right now
                </h2>
                <Link
                  to="loginSignup?mode=login"
                  className={`${classes["button"]} ${classes["type1"]}`}
                ></Link>
              </div>
            </div>
          </div>
        </div>
      </ParallaxLayer>
    </Parallax>
  );
}

export default StartPage;
