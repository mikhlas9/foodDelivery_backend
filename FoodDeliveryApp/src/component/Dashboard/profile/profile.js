import React, { useState, useEffect } from "react";
import Footer from "../footer/footer";
import Header from "../header/header";
import profile from '../image/profile.png'
import '../profile/profilr.css'

function Profile() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState(false);
  const [addressList, setAddressList] = useState([]);

  // Fetch user data from localStorage on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo")) || {};
    
    setUserData({
      name: user.user.username || "Unknown User",
      email: user.user.email || "Unknown Email",
    });
  }, []);

  // Add address to the list
  function addAddress() {
    if (inputValue.trim().length === 0) {
      setInputError(true);
    } else {
      setInputError(false);
      setAddressList([...addressList, inputValue]);
      setInputValue("");
    }
  }

  // Save profile information
  function saveProfile() {
    const profileData = {
      name: userData.name,
      email: userData.email,
      address: addressList,
    };
    localStorage.setItem("profile", JSON.stringify(profileData));
    alert("Profile saved successfully!");
  }

  // Remove address from the list
  function removeAddress(addressToRemove) {
    const updatedList = addressList.filter((address) => address !== addressToRemove);
    setAddressList(updatedList);
  }

  return (
    <div className="profile-bg">
      <Header />
      <div className="profile-main">
        <img src={profile} alt="Profile" className="profile-img" />
        <div className="profile-details">
          <label>Username:</label>
          <p>{userData.name}</p>
          <label>Email:</label>
          <p>{userData.email}</p>
        </div>

        <label>Address:</label>
        <div className="address-section">
          <textarea
            rows="4"
            cols="55"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your address..."
          ></textarea>
          {inputError && <small style={{ color: "red" }}>Please enter a valid address.</small>}
          <button className="add-btn" onClick={addAddress}>
            Add Address
          </button>

          <ul className="address-list">
            {addressList.map((address, index) => (
              <li key={index} className="address-item">
                {address}
                <button className="remove-btn" onClick={() => removeAddress(address)}>
                  x
                </button>
              </li>
            ))}
          </ul>

          <button className="save-btn" onClick={saveProfile}>
            Save Profile
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
