import React from "react";
import "./index.css";
function Loader(){
    return(<div className={"loader-container"}>
    <img src="./src/curtain.gif" alt="Loading...." className={"loader"}></img>
    <p className={"loading-text"}>Please wait, page is loading...</p>
    </div>);
}
export default Loader;