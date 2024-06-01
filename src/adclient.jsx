import { React, useEffect, useState } from "react";
import axios from "axios";

function Adclient(props) {
  const [formData, setFormData] = useState({
    Name: "",
    username: "",
    password: "",
  });
  const [changing, setchan] = useState(0);
  const [checkpw, setpw] = useState(0);
  const [called, setcall] = useState(0);
  const [done, setdone] = useState(-1);
  const [message, setmessage] = useState("");

  function handleChange(event) {
    setFormData((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
    if (event.target.id == "username") {
      setcall(1);
    } else {
      setcall(-1);
    }
  }
  function adcl(event) {
    event.preventDefault();
    axios
      .post("https://server-curtain.onrender.com/add-client", formData)
      .then((res) => {
        setdone(1);
      })
      .catch((err) => {
        setdone(0);
      });
  }
  useEffect(() => {
    if (called == 1) {
      if (formData.username) {
        axios
          .post("https://server-curtain.onrender.com/get-name", {
            username: formData.username,
          })
          .then((res) => {
            if (res.data == "Invalid") {
              console.log("Ok");
              setchan(1);
            } else {
              setchan(0);
            }
          });
      }
    } else if (called == -1) {
      if (
        formData.password.match(
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
        )
      ) {
        setpw(1);
      } else {
        setpw(0);
      }
    }
    setcall(0);
  }, [called]);
  useEffect(() => {
    if (done != -1) {
      if (done == 1) {
        setmessage("Client Added Successfully");
      } else {
        setmessage("Some error occurred. Please try again");
      }
    }
    setdone(-1);
  }, [done]);
  return (
    <div
      id="slider"
      style={
        props.slide === 1
          ? {
              transition: "right 0.5s ease-in-out",
              right: "0",
              overflow: "hidden",
            }
          : {
              transition: "right 0.5s ease-in-out",
              right: "-360px",
              overflow: "hidden",
            }
      }
    >
      <div id="header">
        <h2 onClick={props.here}>
          <i
            id="Cross"
            style={{ marginLeft: "-300px", cursor: "pointer" }}
            className="fas fa-times"
          ></i>
        </h2>
        <h2 style={{ marginTop: "-43px" }}>Add New Client</h2>
        <p>
          Please fill out the form below and we will get back to you as soon as
          possible.
        </p>
        <form id="contact-form" onSubmit={adcl}>
          <input
            name="username"
            type="email"
            placeholder="Enter username / email"
            id="username"
            onChange={handleChange}
            required
          />
          {changing == 1 ? (
            <i
              id="available"
              class="fas fa-check-circle text-success availability-icon"
              style={{
                display: "inline",
                color: "green",
                position: "absolute",
                right: "40px",
                top: "32%",
                transform: "translateY(-50%)",
              }}
            ></i>
          ) : (
            <i
              id="available"
              class="fas fa-times-circle text-danger availability-icon"
              style={{
                display: "inline",
                color: "green",
                position: "absolute",
                right: "40px",
                top: "32%",
                transform: "translateY(-50%)",
              }}
            ></i>
          )}
          <input
            name="password"
            type="text"
            placeholder="Provide a strong password"
            id="password"
            onChange={handleChange}
            required
          />
          {checkpw == 1 ? (
            <i
              id="available"
              class="fas fa-check-circle text-success availability-icon"
              style={{
                display: "inline",
                color: "green",
                position: "absolute",
                right: "40px",
                top: "44%",
                transform: "translateY(-50%)",
              }}
            ></i>
          ) : (
            <i
              id="available"
              class="fas fa-times-circle text-danger availability-icon"
              style={{
                display: "inline",
                color: "green",
                position: "absolute",
                right: "40px",
                top: "44%",
                transform: "translateY(-50%)",
              }}
            ></i>
          )}
          {/* <h4>Query Type</h4> */}
          <ul style={{ color: "black" }}>
            <p>At least 8 characters long password</p>
            <p>
              A combination of uppercase, lowercase letters, numbers, and
              symbols.
            </p>
          </ul>
          <input
            name="Name"
            type="text"
            placeholder="Provide the name of client"
            id="Name"
            onChange={handleChange}
            required
          />
          {message != "" ? (
            <p
              style={
                message == "Client Added Successfully"
                  ? { color: "green" }
                  : { color: "red" }
              }
            >
              {message}
            </p>
          ) : (
            ""
          )}
          <button type="submit" onClick={adcl}>
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Adclient;
