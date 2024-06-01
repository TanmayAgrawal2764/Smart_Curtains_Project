import React, { useState,useEffect } from "react";
import axios from "axios";
import "./index.css";

function Update(props) {
  const [formdata, setformdata] = useState({
    mac: "",
    client: "",
    city: "",
    district: "",
    location: "",
    macAddress: "",
  });
  const [dropdowns, setDropdowns] = useState({
    client: false,
    district: false,
    city: false,
    location: false,
  });
  const [clientOptions, setClient] = useState([]);
  const [cityOptions, setCity] = useState([]);
  const [districtOptions, setDistrict] = useState([]);
  const [locationOptions, setLocation] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setformdata((prev) => ({ ...prev, [id]: value }));

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
      .post("http://localhost:3000/get-dist", { dis_name: value })
      .then((res) => {
        setDistrict(res.data);
      });
  };

  const fetchClients = (value) => {
    axios.get("http://localhost:3000/client-select").then((res) => {
      const filteredClients = res.data.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setClient(filteredClients.length > 0 ? filteredClients : [value]);
    });
  };

  const fetchLocations = (value) => {
    axios.get("http://localhost:3000/location-select").then((res) => {
      const filteredLocations = res.data.filter((name) =>
        name.toLowerCase().includes(value.toLowerCase())
      );
      setLocation(filteredLocations.length > 0 ? filteredLocations : [value]);
    });
  };

  const fetchCities = (value) => {
    axios
      .post("http://localhost:3000/get-cities", { name: value })
      .then((res) => {
        setCity(res.data.results);
      });
  };

  const handleSearch = () => {
    if (!formdata.mac) {
      setMessage("Please enter a MAC address.");
      setShowForm(false);
      return;
    }

    axios
      .post("http://localhost:3000/devicecheck", { id: formdata.mac })
      .then((res) => {
        if (res.data != "Ok") {
          setMessage("Device found. You can update the details.");
          setformdata({client:res.data.client_select,district:res.data["district-select"],city:res.data["city-select"],location:res.data["location-select"],macAddress:res.data.uniqueId})
        } else {
          setMessage("Device not found.");
          setShowForm(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage("An error occurred while searching for the device.");
        setShowForm(false);
      });
  };
  const handleDropdownClick = (id, value) => {
    setformdata((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    console.log(id);
    toggleDropdown(id, false);
  };
  useEffect(()=>{
    if(message=="Device found. You can update the details."){
      setShowForm(true);
    }
  },[message])
  
  const handleUpdate = (event) => {
    event.preventDefault();
    const { addressNumber, client, city, district, location } = formdata;
    if (!client || !city || !district || !location) {
      setMessage("Please fill all the fields.");
      return;
    }
    else{
      axios.post("http://localhost:3000/add-data",formdata).then((res)=>{

      }).catch((err)=>{setMessage("Some Error Occurred")})
    }
    setMessage("Device updated successfully.");
    // axios
    //   .post("http://localhost:3000/update-device", { mac, client, city, district, location })
    //   .then((res) => {
    //     setMessage(res.data.message || "Device updated successfully.");
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     setMessage("An error occurred while updating the device.");
    //   });
  };
  const toggleDropdown = (id, state) => {
    setDropdowns((prevDropdowns) => ({
      ...prevDropdowns,
      [id]: state,
    }));
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
        <h2 style={{ marginTop: "-43px" }}>Update a Device</h2>
        <p>Enter the MAC address to find the device you want to update.</p>
        <div className="custom-select-container">
          <input
            type="text"
            id="mac"
            placeholder="Enter Mac-address"
            value={formdata.mac}
            onChange={handleChange}
            autoComplete="off"
            style={{ color: "black", paddingRight: "100px", paddingTop: "5px" }}
            required
          />
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
        {message && (
          <p
            style={{
              color: message.includes("not found") ? "red" : "green",
              paddingTop: "10px",
            }}
          >
            {message}
          </p>
        )}
        {showForm && (
          <form id="contact-form" onSubmit={handleUpdate}>
            <div className="custom-select-container">
              <input
                type="text"
                id="client"
                placeholder="Change Client Name"
                value={formdata.client}
                onChange={handleChange}
                onFocus={() => toggleDropdown("client", true)}
                required
              />
              {dropdowns.client && (
                <div className="custom-select-dropdown">
                  {clientOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleDropdownClick("client", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="custom-select-container">
              <input
                type="text"
                id="city"
                placeholder="Change City Name"
                value={formdata.city}
                onChange={handleChange}
                onFocus={() => toggleDropdown("city", true)}
                required
              />
              {dropdowns.city && (
                <div className="custom-select-dropdown">
                  {cityOptions.map((option) => (
                    <div
                      onClick={() =>
                        handleDropdownClick("city", option.ascii_name)
                      }
                    >
                      {option.ascii_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="custom-select-container">
              <input
                type="text"
                id="district"
                placeholder="Change District Name"
                value={formdata.district}
                onChange={handleChange}
                onFocus={() => toggleDropdown("district", true)}
                required
              />
              {dropdowns.district && (
                <div className="custom-select-dropdown">
                  {districtOptions.map((option) => (
                    <div
                      onClick={() => handleDropdownClick("district", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="custom-select-container">
              <input
                type="text"
                id="location"
                placeholder="Change Location Name"
                value={formdata.location}
                onChange={handleChange}
                onFocus={() => toggleDropdown("location", true)}
                required
              />
              {dropdowns.location && (
                <div className="custom-select-dropdown">
                  {locationOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleDropdownClick("location", option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="custom-select-container">
              <input
                type="text"
                id="macAddress"
                placeholder="Enter Mac-Address"
                value={formdata.macAddress}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Update Device</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Update;
