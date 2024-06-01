import React, { useState, useEffect, Suspense, lazy } from "react";
import Loader from "./loader";
import Header from "./header";
import Footer from "./Footer";
import { AnimatePresence } from "framer-motion";
// import Home from "./home";
// import View from "./view";
// import Login from "./login";
import { Routes, Route, useNavigate } from "react-router-dom";
const Home=lazy(()=>import("./home"));
const View=lazy(()=>import("./view"));
const Login=lazy(()=>import("./login"));

function App() {
  const [login,setlogin]=useState("Out");
  const [id_view, setid] = useState("");
  const [cs,setcs]=useState("");
  const [ds,setds]=useState("");
  const [cis,setcis]=useState("");
  const [ls,setls]=useState("");
  // console.log("YES",cs,1,ds,"Yes");
  function ok(e) {
    setid(e.target.name);
  }
  return (
    <AnimatePresence>
    <>
    <Suspense fallback={<Loader/>}>
        <>
          <Header login={login} setlogin={setlogin} cs={cs}/>
          <Routes>
            <Route
              path="/"
              element={<Login setlogin={setlogin} login={login} setcs={setcs}/>}
            ></Route>
            <Route
              path="home"
              element={<Home id_view={id_view} ok={ok} login={login} ls={ls} cs={cs} ds={ds} cis={cis} setcs={setcs} setds={setds} setcis={setcis} setls={setls} setlogin={setlogin}/>}
            ></Route>
            <Route
              path="/view"
              element={<View id_view={id_view} login={login}/>}
            ></Route>
          </Routes>
          <Footer />
        </>
      </Suspense>
    </>
    </AnimatePresence>
  );
}
export default App;
