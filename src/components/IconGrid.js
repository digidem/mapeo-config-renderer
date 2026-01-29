import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./IconGrid.css";
import axios from "axios";
import io from "socket.io-client";

const API_ROOT = "http://localhost:5000/api/catfile";
const socket = io("http://localhost:5000");

const fetchPresets = async (catfile) => {
  try {
    const { data } = await axios.get(`${API_ROOT}/${catfile}/presets`);
    return data.data ? data.data : data;
  } catch (error) {
    console.error("Failed to fetch presets:", error);
    return null;
  }
};

const fetchMetadata = async (catfile) => {
  try {
    const { data } = await axios.get(`${API_ROOT}/${catfile}/metadata`);
    return data.data ? data.data : data;
  } catch (error) {
    console.error("Failed to fetch metadata:", error);
    return null;
  }
};

const fetchCategorySelection = async (catfile) => {
  try {
    const { data } = await axios.get(
      `${API_ROOT}/${catfile}/categorySelection`,
    );
    return data.data ? data.data : data;
  } catch (error) {
    console.error("Failed to fetch categorySelection:", error);
    return null;
  }
};

const IconGrid = () => {
  let { catfile } = useParams();
  if (!catfile) catfile = "default";
  const [presets, setPresets] = useState({});
  const [categorySelection, setCategorySelection] = useState(new Map());
  const [metadata, setMetadata] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchPresets(catfile);
      setPresets(data);
    };
    fetchData();

    // Listen for updates from the server
    socket.on("presets:update", async () => {
      const data = await fetchPresets(catfile);
      setPresets(data);
    });

    // Clean up the effect
    return () => socket.off("presets:update");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategorySelection(catfile);
      const jointSelection = [...data.observation, ...data.track];
      setCategorySelection(
        new Map(jointSelection.map((val, idx) => [val, idx])),
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMetadata(catfile);
      setMetadata(data);
    };
    fetchData();
  }, []);
  const handlePresetClick = (key) => {
    navigate(`/catfile/${catfile}/preset/${key}`);
  };

  return (
    <div className="phone-outer-frame">
      <div className="phone-frame">
        <div className="app-header">
          <div className="app-title">{metadata && metadata.name}</div>
          <span className="app-title-date">
            {metadata && new Date(metadata.buildDateValue).toLocaleDateString()}
          </span>
        </div>

        <div className="icon-grid">
          {presets && presets.length === 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading presets...</div>
            </div>
          )}

          {presets &&
            Object.entries(presets)
              .sort((a, b) => {
                const [key1] = a;
                const [key2] = b;
                return (
                  categorySelection.get(key1) - categorySelection.get(key2)
                );
              })
              .map(([key, preset]) => (
                <div
                  key={key}
                  className="icon-container"
                  onClick={() => handlePresetClick(key)}
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
