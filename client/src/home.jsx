import { React, useState,memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Client from "./client";
import District from "./district";
import City from "./city";
import Location from "./location";
import SensorCard from "./sensorcard";
import axios from "axios";
import "./index.css";

function Home(props) {
  const navigate=useNavigate();
  const [s,sets]=useState(0);
  useEffect(()=>{
    const val=JSON.parse(sessionStorage.getItem("user"));
    if(! val){
      navigate("/")
    }
    else{
      axios.post("http://localhost:3000/get-name",{username:val.username,password:val.password}).then((res)=>{
        if(res.data.flag=="client"){
          props.setcs(res.data.name);
        setTimeout(() => {
          props.setlogin("Client");
        }, 10);
        }
      
    else{
      // props.setcs("Select Client");
      if(res.data.flag=="admin"){
        props.setcs("");
        props.setlogin("Admin");
      }
      else{
        sessionStorage.clear();
        navigate("/");
        console.log("Out");
        
      }
    }
  })
}
  },[props.login])
  function display(){
    sets(s+1);
  }
  function change(id, val) {
    if(id=="client-select"){
      props.setcs(val);
    }
    else if(id=="district-select"){
      props.setds(val);
    }
    else if(id=="city-select"){
      props.setcis(val);
    }
    else{
      props.setls(val);
    }
  }
  return (
    <>
      <div class="search-bar">
        <Client change={change} ls={props.ls} cs={props.cs} ds={props.ds} cis={props.cis} login={props.login} />
        <District ls={props.ls} cs={props.cs} ds={props.ds} cis={props.cis} change={change} login={props.login}/>
        <City ls={props.ls} cs={props.cs} ds={props.ds} cis={props.cis} change={change} login={props.login}/>
        <Location ls={props.ls} cs={props.cs} ds={props.ds} cis={props.cis} change={change} login={props.login}/>
        <button id="search-button" onClick={display}>Search/Reload</button>
        <SensorCard ok={props.ok} s={s} id_view={props.id_view} ls={props.ls} cs={props.cs} ds={props.ds} cis={props.cis} isLf={props.isLf} login={props.login} sets={sets}/>
      </div>
    </>
  );
}
export default memo(Home);
