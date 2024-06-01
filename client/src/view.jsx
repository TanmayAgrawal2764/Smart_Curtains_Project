import React, { useState, useEffect,memo } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function View(props) {
  const navigate=useNavigate();
  const [data, setdata] = useState([]);
  const [check, setcheck] = useState(-1);
  const [ref, setref] = useState(0);
  function chit() {
    if(check==-1){
      setcheck(1);
    }
    else if (check == 0) {
      setcheck(1);
    } else {
      setcheck(0);
    }
  }
  function chitt() {
      setref(ref + 1);
  }
  useEffect(()=>{
    if(check!=-1){
    axios.post("http://localhost:3000/change",{st:check,id:props.id_view}).then((res)=>{
    }).catch((err)=>{console.log(err);});
  }
  },[check]);

  useEffect(() => {
    axios.post("http://localhost:3000/find", props).then((res) => {
      setdata(res.data);
    });
  }, [ref]);
  useEffect(()=>{
    if(props.login=="Out"){
      navigate("/")
    }
  })
  
  return (
    <>
      {data[0]?(<div class="card-container">
        <div class="device-id">
          <h2>
            Device ID: <span class="id-text">{data[0]["uniqueId"]}</span>
          </h2>
        </div>
        <div class="separator"></div>
        <div class="value-container">
          <div>
            <div class="value-circle">
              <div>{Math.round(data[0]["Indoor_Temp"])}°C</div>
              <div>
                <i class="fas fa-thermometer-half"></i>
              </div>
            </div>
            <div class="value-name">Indoor Temperature</div>
          </div>
          <div>
            <div class="value-circle">
              <div>1000</div>
              <div>
                <i class="fas fa-tachometer-alt"></i>
              </div>
            </div>
            <div class="value-name">RPM</div>
          </div>
          <div>
            <div class="value-circle">
              <div>{Math.round(data[0]["Outdoor_Temp"])}°C</div>
              <div>
                <i class="fas fa-sun"></i>
              </div>
            </div>
            <div class="value-name">Oudoor Temperature</div>
          </div>
          <div>
            <div class="value-circle">
              <div>{data[0]["Door_Count"]}</div>
              <div>
                <i class="fas fa-door-open"></i>
              </div>
            </div>
            <div class="value-name">Door_Count</div>
          </div>
          <div>
            <div class="value-circle">
              <div>{(check==-1||check==0)?"OFF":"ON"}</div>
              <div>
                <i class="fas fa-power-off"></i>
              </div>
            </div>
            <div class="value-name">Status</div>
          </div>
          <div>
            <div class="value-circle">
              <div>{Math.round(data[0]["Power"])}W</div>
              <div>
                <i class="fas fa-bolt"></i>
              </div>
            </div>
            <div class="value-name">Power</div>
          </div>
        </div>

        <div class="button-container">
          {props.login=="Admin"?<button onClick={chit}>Change Status</button>:null}
          <button onClick={chitt}>Refresh</button>
        </div>
      </div>):null}
    </>
  );
}
export default View;
