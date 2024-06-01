import React,{useState,useEffect} from "react";
import axios from "axios";
function City(props) {
  const [data,setdata]=useState([]);
  function callit(event) {
    props.change(event.target.id, event.target.value);
  }
  var ds = props.ds;
  useEffect(()=>{
    
    axios.get("http://localhost:3000/city-select").then((res) => {
      setdata(res.data);
    });
  },[]);

  return (
    <>
    <select id="city-select" onChange={callit} value={props.cis}>
      <option id="3" value="">
          Select City
        </option>
      {data.map((ele)=>{
        return(<option key={ele} id={ele} value={ele}>{ele}</option>)
      })}
    </select>
    </>
  );
}
export default City;
