import React, { useState } from "react";
import Contact from "./contact";
import Add from "./add";
import Update from "./update";
import Delete from "./delete";
import Adclient from "./adclient";
import Delcl from "./delcl";
function Header(props) {
  const comps={Contact,Add}
  const [formdata,setformdata]=useState("");
  const [slide,setslide]=useState(0);
  function dropit(event) {
    if (event.target.classList.contains("dropdown-toggle")) {
      event.target.classList.toggle("toggle-change");
    } else if (
      event.target.classList.contains("dropdown-toggle")
    ) {
      event.target.parentElement.classList.toggle("toggle-change");
    }
  }
  function logmeout(){
    sessionStorage.clear();
    props.setlogin("Out");
  }
  function here(event){
    setTimeout(()=>{
      setslide(slide==0?1:0);
    },10);
    if(event.target.id!="Cross"){
      setformdata(event.target.id);}
  }
  return (
    <header className="navbar">
      <img
        id="mitz_logo"
        src="https://www.mitzvah.in/wp-content/themes/twentyfifteen-child/images/logo.png"
        alt="Logo"
      />
      <h1>Mitzvah Engg.(India) Pvt. Limited</h1>
      {props.login!="Out"?
      <div className="profile-menu">
        <div className="nav-item dropdown" onClick={dropit}>
          <a
            className="nav-link dropdown-toggle"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className="profile-pic">
              <img src="./src/image.png" alt="Profile Picture" />
            </div>
          </a>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
          <li>
              <a className="dropdown-item">
              <i className="fas fa-user fa-fw"></i> Username: <b>{props.login=="Admin"?"Admin":props.cs}</b>
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            {props.login=="Admin"?
            <>
            <li>
              <a className="dropdown-item" href="#" id="Add" onClick={here}>
                <i className="fas fa-sliders-h fa-fw"></i> Add/Link a Device
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#" id="Update" onClick={here}>
              <i class="fas fa-sync fa-fw"></i> Update a Device
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#" id="Delete" onClick={here}>
                <i className="fas fa-cog fa-fw"></i> Delete/Unlink a Device
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#" id="New client" onClick={here}>
              <i class="fas fa-user-plus fa-fw"></i>
 Add a new client
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="#" id="Delete client" onClick={here}>
              <i class="fas fa-user-minus fa-fw"></i>
 Remove a client
              </a>
            </li>
            </>
            :null}
            <li>
              <a className="dropdown-item" href="#" id="Contact" onClick={here}>
              <i class="fas fa-envelope fa-fw"></i> Contact Us
              </a>
            </li>
            <li>
              <a className="dropdown-item" id="logit" onClick={logmeout} href="#">
                <i className="fas fa-sign-out-alt fa-fw"></i> Log Out
              </a>
            </li>
          </ul>
        </div>
      </div>
      :null}
      {formdata=="Add"?<Add here={here} slide={slide}></Add>:formdata=="Contact"?<Contact here={here} slide={slide}></Contact>:formdata=="Update"?<Update here={here} slide={slide}></Update>:formdata=="Delete"?<Delete here={here} slide={slide}></Delete>:formdata=="New client"?<Adclient here={here} slide={slide}></Adclient>:<Delcl here={here} slide={slide}></Delcl>}
    </header>
  );
}

export default Header;
