import React, { useState, useEffect } from "react";
import "./IconGrid.css";
import axios from "axios";

const fetchPresets = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/presets");
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch presets:", error);
    return [];
  }
};

const IconGrid = () => {
  const [presets, setPresets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPresets();
      setPresets(data);
    };
    fetchData();
  }, []);

  return (
    <div className="phone-outer-frame">
      <div className="phone-frame">
        <div className="icon-grid">
          {presets.map((preset) => (
            <div key={preset.name} className="icon-container">
              <div
                className="icon"
                style={{
                  backgroundColor: "white",
                  borderColor: preset.color,
                  borderWidth: 3.5,
                }}
              >
                <img
                  src={preset.iconPath}
                  alt={preset.name}
                  style={{ maxWidth: "35px", height: "35px" }}
                />
              </div>
              <div className="icon-name">{preset.name}</div>
            </div>
          ))}
        </div>
        <div className="bottom-circle"></div>
      </div>
    </div>
  );
};

export default IconGrid;
