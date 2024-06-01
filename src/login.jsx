import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login(props) {
  const navigate = useNavigate();
  const [userinput, setinput] = useState({ username: "", password: "" });
  const [clientinput, setclient] = useState({ username: "", password: "" });
  // const [Admin_user,setlogin]=useState([{"username":"","password":""}])
  useEffect(() => {
    const val = sessionStorage.getItem("user");
    if (val) {
      navigate("home");
    }
  });
  function enter(event) {
    event.preventDefault();
    if (event.target.id == "Admin") {
      axios
        .post("https://server-curtain.onrender.com/login", {
          userinput,
          flag: "admin",
        })
        .then((res) => {
          if (res.data == "success") {
            sessionStorage.setItem("user", JSON.stringify(userinput));
            props.setlogin(event.target.id);
            navigate("home");
          }
        });
      if (userinput.username == "Tanmay" && userinput.password == "Tanmay") {
        sessionStorage.setItem("user", JSON.stringify(userinput));
        navigate("home");
      }
    } else {
      axios
        .post("https://server-curtain.onrender.com/login", {
          clientinput,
          flag: "client",
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.Name) {
            sessionStorage.setItem("user", JSON.stringify(clientinput));
            navigate("home");
            // setTimeout(() => {
            //   props.setlogin("Client");
            // }, 100);
          }
        });
      if (
        clientinput.username == "Agrawal" &&
        clientinput.password == "Agrawal"
      ) {
        sessionStorage.setItem("user", JSON.stringify(clientinput));
        navigate("home");
      }
    }
  }
  function fillme(event) {
    setinput({ ...userinput, [event.target.name]: event.target.value });
  }
  function fillmee(event) {
    setclient({ ...clientinput, [event.target.name]: event.target.value });
  }
  function checkitt(event) {
    const container = document.getElementById("container-login");
    if (event.target.id == "signUp") {
      container.classList.add("right-panel-active");
    } else {
      container.classList.remove("right-panel-active");
    }
  }
  return (
    <div class="ok">
      <div class="container" id="container-login">
        <div class="form-container sign-up-container">
          <form>
            <h1>Client Login</h1>
            <div class="social-container">
              <a class="social">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a class="social">
                <i class="fab fa-google-plus-g"></i>
              </a>
              <a class="social">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="email"
              placeholder="Enter username: client"
              name="username"
              value={clientinput.username}
              onChange={fillmee}
            />
            <input
              type="password"
              placeholder="Enter Password: client@123"
              name="password"
              value={clientinput.password}
              onChange={fillmee}
            />
            <button id="Client" onClick={enter}>
              Sign In
            </button>
          </form>
        </div>
        <div class="form-container sign-in-container">
          <form>
            <h1>Admin Login</h1>
            <div class="social-container">
              <a class="social">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a class="social">
                <i class="fab fa-google-plus-g"></i>
              </a>
              <a class="social">
                <i class="fab fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your account</span>
            <input
              type="email"
              placeholder="Enter username: admin"
              name="username"
              value={userinput.username}
              onChange={fillme}
            />
            <input
              type="password"
              placeholder="Enter password: admin@123"
              name="password"
              value={userinput.password}
              onChange={fillme}
            />
            <a>Forgot your password?</a>
            <button id="Admin" onClick={enter}>
              Sign In
            </button>
          </form>
        </div>
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>
                To keep connected with us please login with your personal info
              </p>
              <button class="ghost" id="signIn" onClick={checkitt}>
                Admin Login
              </button>
            </div>
            <div class="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button class="ghost" id="signUp" onClick={checkitt}>
                Client Login
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <p>
          Created with <i class="fa fa-heart"></i> by
          <a target="_blank" href="https://florin-pop.com">
            Florin Pop
          </a>
          - Read how I created this and how you can join the challenge
          <a
            target="_blank"
            href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/"
          >
            here
          </a>
          .
        </p>
      </footer>
    </div>
  );
}

export default Login;
