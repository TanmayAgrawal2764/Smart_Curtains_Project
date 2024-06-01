import React, { useState } from "react";
import axios from "axios";
import "./index.css";

function Add(props) {
  const [client, setClient] = useState([]);
  const [city, setCity] = useState([]);
  const [district, setDistrict] = useState([]);
  const [location, setLocation] = useState([]);
  const [flag, setFlag] = useState("");
  const [formValues, setFormValues] = useState({
    client: "",
    district: "",
    city: "",
    location: "",
    macAddress: "",
  });
  const [dropdowns, setDropdowns] = useState({
    client: false,
    district: false,
    city: false,
    location: false,
  });

  const handleInputChange = (event) => {
    setFlag("");
    const { id, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));

    if (id === "district") {
      fetchDistricts(value);
    } else if (id === "client") {
      fetchClients(value);
    } else if (id === "location") {
      fetchLocations(value);
    } else if (id === "city") {
      fetchCities(value);
    }
  };

  const fetchDistricts = (value) => {
    axios
      .post("http://localhost:3001/get-dist", { dis_name: value })
      .then((res) => {
        setDistrict(res.data);
      });
  };

  const fetchClients = (value) => {
    axios.get("http://localhost:3001/client-select").then((res) => {
      const filteredClients = res.data.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setClient(filteredClients.length > 0 ? filteredClients : [value]);
    });
  };

  const fetchLocations = (value) => {
    axios.get("http://localhost:3001/location-select").then((res) => {
      const filteredLocations = res.data.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setLocation(filteredLocations.length > 0 ? filteredLocations : [value]);
    });
  };

  const fetchCities = (value) => {
    axios
      .post("http://localhost:3001/get-cities", { name: value })
      .then((res) => {
        setCity(res.data.results);
      });
  };

  const handleDropdownClick = (id, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    toggleDropdown(id, false);
  };

  const toggleDropdown = (id, state) => {
    setDropdowns((prevDropdowns) => ({
      ...prevDropdowns,
      [id]: state,
    }));
  };
  const checkAdd = (event) => {
    event.preventDefault();
    const { client, district, city, location, macAddress } = formValues;

    if (!client || !district || !city || !location || !macAddress) {
      setFlag("Please fill all the fields");
    } else if (macAddress.length !== 17) {
      setFlag(
        "Invalid Mac-Address Provided (Ensure there are no extra spaces before and after the written id)"
      );
    } else {
      axios
        .post("http://localhost:3001/devicecheck", { id: macAddress })
        .then((res) => {
          if (res.data != "Ok") {
            setFlag("Device with given mac address already exists");
          } else {
            setFlag("Device Added Successfully");
            axios
              .post("http://localhost:3001/add-data", formValues)
              .then((res) => {
              })
              .catch((err) => setFlag("Some Error Occured!"));
          }
        });
    }
  };
  function hideall(event) {
    console.log(event.target.id);
    if (event.target.id == "" || event.target.id == "header") {
      toggleDropdown("client", false);
      toggleDropdown("city", false);
      toggleDropdown("district", false);
      toggleDropdown("location", false);
    }
  }
  return (
    <div
      id="slider"
      style={props.slide === 1 ? { right: "0px" } : { right: "-360px" }}
      onClick={hideall}
    >
      <div id="header">
        <h2 onClick={props.here}>
          <i
            id="Cross"
            style={{ marginLeft: "-300px", cursor: "pointer" }}
            className="fas fa-times"
          ></i>
        </h2>
        <h2 style={{ marginTop: "-43px" }}>Add New Device</h2>
        <p>
          Please fill out the form below and we will get back to you as soon as
          possible.
        </p>
        <form id="contact-form">
          <div className="custom-select-container">
            <input
              type="text"
              id="client"
              placeholder="Enter Client Name"
              value={formValues.client}
              onFocus={() => toggleDropdown("client", true)}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            {dropdowns.client && (
              <div className="custom-select-dropdown">
                {client.map((ele, index) => (
                  <div
                    key={index}
                    onClick={() => handleDropdownClick("client", ele)}
                  >
                    {ele}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="custom-select-container">
            <input
              type="text"
              id="district"
              placeholder="Choose District Name"
              value={formValues.district}
              onFocus={() => toggleDropdown("district", true)}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            {dropdowns.district && (
              <div className="custom-select-dropdown">
                {district.map((ele, index) => (
                  <div
                    key={index}
                    onClick={() => handleDropdownClick("district", ele)}
                  >
                    {ele}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="custom-select-container">
            <input
              type="text"
              id="city"
              placeholder="Choose City Name"
              value={formValues.city}
              onFocus={() => toggleDropdown("city", true)}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            {dropdowns.city && (
              <div className="custom-select-dropdown">
                {city.map((ele, index) => (
                  <div
                    key={index}
                    onClick={() => handleDropdownClick("city", ele.ascii_name)}
                  >
                    {ele.ascii_name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="custom-select-container">
            <input
              type="text"
              id="location"
              placeholder="Enter Location Name"
              value={formValues.location}
              onFocus={() => toggleDropdown("location", true)}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            {dropdowns.location && (
              <div className="custom-select-dropdown">
                {location.map((ele, index) => (
                  <div
                    key={index}
                    onClick={() => handleDropdownClick("location", ele)}
                  >
                    {ele}
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            name="dname"
            type="text"
            placeholder="Enter Mac-address"
            id="macAddress"
            value={formValues.macAddress}
            onChange={handleInputChange}
            required
          />
          <h4>Query Type</h4>
          <p
            style={
              flag != "Device Added Successfully"
                ? { color: "red" }
                : { color: "green" }
            }
          >
            {flag}
          </p>
          <button type="submit" onClick={checkAdd}>
            Add the Device
          </button>
        </form>
      </div>
    </div>
  );
}

export default Add;
