import React, { useEffect, useState, memo } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
function SensorCard(props) {
  const [stat, setstat] = useState([]);
  const [statcpy, setstatcpy] = useState([]);
  function viewit(event) {
    props.ok(event);
  }
  
  useEffect(() => {
    if(props.login=="Client" || props.login=="Admin"){
    document.getElementById("all").checked = true;
    axios.post("http://localhost:3000/device-select", props).then((res) => {
      setstat([]);
      setstatcpy([]);
      // console.log(props,stat,statcpy);
      res.data.map((ele) => {
        axios
          .post("http://localhost:3000/find", { id_view: ele["uniqueId"] })
          .then((resu) => {
            if(resu.data[0]!=null){
              axios.post("http://localhost:3000/checki",{id:ele["uniqueId"]}).then((nres)=>{
                setstat((prev) => {
                  return [
                    ...prev,
                    { [ele["uniqueId"]]: [Object.assign(resu.data[0], ele,{status:nres.data})] },
                  ];
                });
                setstatcpy((previ) => {
                  // console.log(ele,"Tanmay");
                  return [
                    ...previ,
                    { [ele["uniqueId"]]: [Object.assign(resu.data[0], ele)] },
                  ];
                });
              })
          }
          });
      });
    });
  }
  }, [props]);
  
  function filterit(event) {
    if (event.target.value == "All" || event.target.value == "inactive") {
      setstatcpy(stat);
    } else if (event.target.value == "active") {
      setstatcpy([]);
    } else {
      console.log(stat);
      setstatcpy(
        stat.filter((ele) => {
          return ele[Object.keys(ele)[0]][0]["Power"] >= 1000;
        })
      );
    }
  }
  function chitst(event){
    axios.post("http://localhost:3000/checki",{id:event.target.id}).then((res)=>{
      if(res.data=="ON"){
        if(event.target.checked==false){
          axios.post("http://localhost:3000/change",{id:event.target.id,st:0})
        }
        else{
          axios.post("http://localhost:3000/change",{id:event.target.id,st:1})
        }
      }
      else{
        event.target.checked=false;
      }
    })
  }
  return (
    <>
      <div class="table-wrapper table-striped">
        <div class="table-title">
          <div class="row">
            <div class="col-sm-3">
              {/* <h2>Filtered Result</h2> */}
            </div>
            <div class="col-sm-9">
              <div class="btn-group" data-goggle="buttons">
                <label
                  class="btn btn-info active"
                  style={{ paddingRight: "35px", paddingLeft: "15px" }}
                >
                  <input
                    type="radio"
                    name="status"
                    value="All"
                    onClick={filterit}
                    defaultChecked
                    id="all"
                  />
                  All
                </label>
                <label
                  class="btn btn-success"
                  style={{ paddingRight: "59px", paddingLeft: "15px" }}
                >
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    onClick={filterit}
                  />
                  Active
                </label>
                <label
                  class=" btn btn-warning"
                  style={{ paddingRight: "68px", paddingLeft: "15px" }}
                >
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    onClick={filterit}
                  />
                  Inactive
                </label>
                <label
                  class=" btn btn-danger"
                  style={{ paddingRight: "68px", paddingLeft: "15px" }}
                >
                  <input
                    type="radio"
                    name="status"
                    value="expired"
                    onClick={filterit}
                  />
                  Expired
                </label>
              </div>
            </div>
          </div>
        </div>
        <table class=" table table-striped table-hover tableeee">
          <thead>
            <tr style={{fontSize:"16px",fontFamily:"sans-serif"}}>
              <th><u>SNo.</u></th>
              <th><u>ID</u></th>
              <th><u>Client</u></th>
              <th><u>District</u></th>
              <th><u>City</u></th>
              <th><u>Location</u></th>
              {props.login=="Admin"?<th><u>Change Status</u></th>:null}
              <th><u>Status</u></th>
              <th><u>Active</u></th>
            </tr>
          </thead>
          <tbody>
            { statcpy.map((ele, index) => {
              return (
                <tr data-status="active" key={index+1}>
                  <td>{index + 1}</td>
                  <td>{ele[Object.keys(ele)[0]][0]["uniqueId"]}</td>
                  <td>{ele[Object.keys(ele)[0]][0]["client_select"]}</td>
                  <td>{ele[Object.keys(ele)[0]][0]["district-select"]}</td>
                  <td>{ele[Object.keys(ele)[0]][0]["city-select"]}</td>
                  <td>{ele[Object.keys(ele)[0]][0]["location-select"]}</td>
                  {props.login=="Admin"?<td>
                    <div class="toggle-container">
                      <label class="switch">
                        <input type="checkbox" id={ele[Object.keys(ele)[0]][0]["uniqueId"]} onClick={chitst} />
                        <span class="slider round"></span>
                      </label>
                    </div>
                  </td>:null}
                  <td>
                    <span
                      style={{
                        paddingTop: "8px",
                        paddingBottom: "8px",
                        fontSize: "13px",
                      }}
                      className={
                        "label label-" +
                        (ele[Object.keys(ele)[0]][0]["Power"] > 1000?"danger": ele[Object.keys(ele)[0]][0]["status"]=="ON"
                          ? "success"
                          : "warning")
                      }
                    >
                      {(ele[Object.keys(ele)[0]][0]["Power"] > 1000?"Danger": ele[Object.keys(ele)[0]][0]["status"]=="ON"
                          ? "Active"
                          : "Inactive")}
                    </span>
                  </td>
                  <td>
                    <NavLink to="/view">
                      <button
                        onClick={viewit}
                        login={props.login}
                        class="view-button btn btn-sm manage"
                        id="view-button"
                        name={Object.keys(ele)[0]}
                      >
                        View
                      </button>
                    </NavLink>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default memo(SensorCard);