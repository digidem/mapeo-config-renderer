import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./IconGrid.css";
import axios from "axios";
import io from "socket.io-client";
import { useLanguage } from "../contexts/LanguageContext";

const API_ROOT = "/api/catfile";
const socket = io("http://localhost:5000");

const fetchCategories = async (catfile, lang) => {
  try {
    const { data } = await axios.get(`${API_ROOT}/${catfile}/categories`, {
      params: { lang },
    });
    return data.data ? data.data : data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
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
  const [categories, setCategories] = useState({});
  const [categorySelection, setCategorySelection] = useState(new Map());
  const [metadata, setMetadata] = useState({});
  const navigate = useNavigate();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategories(catfile, language);
      setCategories(data);
    };
    fetchData();

    // Listen for updates from the server
    socket.on("presets:update", async () => {
      const data = await fetchCategories(catfile, language);
      setCategories(data);
    });

    // Clean up the effect
    return () => socket.off("presets:update");
  }, [catfile, language]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCategorySelection(catfile);
      const jointSelection = [...data.observation, ...data.track];
      setCategorySelection(
        new Map(jointSelection.map((val, idx) => [val, idx])),
      );
    };
    fetchData();
  }, [catfile]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchMetadata(catfile);
      setMetadata(data);
    };
    fetchData();
  }, [catfile]);

  const handlePresetClick = (key) => {
    navigate(`/catfile/${catfile}/categories/${key}`);
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
          {categories && categories.length === 0 && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Loading categories...</div>
            </div>
          )}

          {categories &&
            Object.entries(categories)
              .sort((a, b) => {
                const [key1] = a;
                const [key2] = b;
                return (
                  categorySelection.get(key1) - categorySelection.get(key2)
                );
              })
              .map(([key, category]) => (
                <div
                  key={key}
                  className="icon-container"
                  onClick={() => handlePresetClick(key)}
                >
                  <div
                    className="icon"
                    style={{
                      borderColor: category.color,
                    }}
                  >
                    <img
                      src={category.iconPath}
                      alt={category.name}
                      className="icon-image"
                    />
                  </div>
                  <div className="icon-name">{category.name}</div>
                </div>
              ))}

          {!categories && (
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
