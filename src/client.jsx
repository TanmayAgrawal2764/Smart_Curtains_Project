import { React, useEffect, useState } from "react";
import axios from "axios";
function Client(props) {
  const [data, setdata] = useState([]);
  function callit(event) {
    props.change(event.target.id, event.target.value);
  }
  let content = [];
  useEffect(() => {
    if (props.login == "Admin" && data != []) {
      axios
        .get("https://server-curtain.onrender.com/client-select")
        .then((res) => {
          // console.log(res.data);
          setdata(() => {
            // const sortit=Array.from(new Set(res.data));
            // sortit.sort((a,b)=>{return(a<b)});
            // console.log(sortit);
            return res.data;
          });
        });
    }
  }, [props.login]);
  return (
    <select
      id="client-select"
      onChange={callit}
      disabled={props.login == "Client"}
    >
      <option key="1a" id="1" value="">
        {props.login == "Admin" ? "Select Client" : props.cs}
      </option>
      {data.map((item) => {
        return (
          <option key={item} id={item} value={item}>
            {item}
          </option>
        );
      })}
      {content}
    </select>
  );
}
export default Client;
