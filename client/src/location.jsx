import React,{useState,useEffect} from "react";
import axios from "axios";

function Location(props) {
  const [data,setdata]=useState([]);
  function callit(event) {
    props.change(event.target.id, event.target.value);
  }
  useEffect(()=>{
    axios.get("http://localhost:3001/location-select").then((res) => {
      setdata(res.data);
    });
  },[]);
  return (
    <select id="location-select" value={props.ls} onChange={callit}>
      <option id="4" value="">
          Select Location
        </option>
      {data.map((ele)=>{
        return(<option key={ele} id={ele} value={ele}>{ele}</option>)
      })}
    </select>
  );
}
export default Location;
