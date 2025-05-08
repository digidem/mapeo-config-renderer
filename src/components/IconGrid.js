import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./IconGrid.css";
import axios from "axios";
import io from "socket.io-client";
import packageJson from "../../package.json";

const socket = io("http://localhost:5000");

const fetchPresets = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/presets");
    return data.data ? data.data : data;
  } catch (error) {
    console.error("Failed to fetch presets:", error);
    return null;
  }
};

const IconGrid = () => {
  const [presets, setPresets] = useState([]);
  const navigate = useNavigate();

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

  const handlePresetClick = (preset) => {
    navigate(`/preset/${preset.name}`);
  };

  return (
    <div className="phone-outer-frame">
      <div className="phone-frame">
        <div className="app-header">
          <div className="app-title">Mapeo Presets</div>
          <div className="app-version">{packageJson.version}</div>
        </div>

        <div className="icon-grid">
          {presets && presets.length === 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading presets...</div>
            </div>
          )}

          {presets &&
            presets.map((preset) => (
              <div
                key={preset.name}
                className="icon-container"
                onClick={() => handlePresetClick(preset)}
              >
                <div
                  className="icon"
                  style={{
                    borderColor: preset.color,
                  }}
                >
                  <img
                    src={preset.iconPath}
                    alt={preset.name}
                    className="icon-image"
                  />
                </div>
                <div className="icon-name">{preset.name}</div>
              </div>
            ))}

          {!presets && (
            <div className="error-message">
              Mapeo configuration folder not detected, make sure you are inside
              or passing the right folder
            </div>
          )}
        </div>

        <div className="bottom-circle"></div>
      </div>
    </div>
  );
};

export default IconGrid;
