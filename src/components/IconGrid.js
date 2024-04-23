import React, { useState, useEffect } from "react";
import "./IconGrid.css";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const fetchPresets = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/presets");
    console.log("response", data);
    return data.data ? data.data : data;
  } catch (error) {
    console.error("Failed to fetch presets:", error);
    return null;
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

    // Listen for updates from the server
    socket.on("presets:update", async () => {
      const data = await fetchPresets();
      setPresets(data);
    });

    // Clean up the effect
    return () => socket.off("presets:update");
  }, []);
  return (
    <div className="phone-outer-frame">
      <div className="phone-frame">
        <div className="icon-grid">
          {presets && presets.length === 0 && <span className="vertical-center">Loading...</span>}
          {presets && presets.map((preset) => (
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
          {!presets && <span className="vertical-center">Mapeo configuration folder not detected, make sure you are inside or passing the right folder</span>}
        </div>
        <div className="bottom-circle"></div>
      </div>
    </div>
  );
};

export default IconGrid;
