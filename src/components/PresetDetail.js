import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PresetDetail.css";

const fetchPreset = async (presetId) => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/presets");
    const presets = data.data ? data.data : data;
    return presets.find((preset) => preset.name === presetId);
  } catch (error) {
    console.error("Failed to fetch preset:", error);
    return null;
  }
};

const fetchFields = async () => {
  try {
    const { data } = await axios.get("http://localhost:5000/api/fields");
    return data;
  } catch (error) {
    console.error("Failed to fetch fields:", error);
    return [];
  }
};

const PresetDetail = () => {
  const { presetId } = useParams();
  const navigate = useNavigate();
  const [preset, setPreset] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const presetData = await fetchPreset(presetId);
      const fieldsData = await fetchFields();

      setPreset(presetData);

      // Filter fields to only include those referenced by the preset
      if (presetData && presetData.fields && fieldsData) {
        const presetFields = fieldsData.filter((field) =>
          presetData.fields.includes(field.tagKey || field.key),
        );
        setFields(presetFields);
      }

      setLoading(false);
    };

    fetchData();
  }, [presetId]);

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>
            <input
              type="text"
              className="field-input"
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
            />
            {field.helperText && (
              <div className="field-helper">{field.helperText}</div>
            )}
          </div>
        );

      case "number":
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>
            <input
              type="number"
              className="field-input"
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
            />
            {field.helperText && (
              <div className="field-helper">{field.helperText}</div>
            )}
          </div>
        );

      case "selectOne":
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>
            <div className="select-options">
              {field.options &&
                field.options.map((option) => (
                  <div key={option.value} className="select-option">
                    <div className="radio-button"></div>
                    <div className="option-label">{option.label}</div>
                  </div>
                ))}
            </div>
            {field.helperText && (
              <div className="field-helper">{field.helperText}</div>
            )}
          </div>
        );

      case "selectMultiple":
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>
            <div className="select-options">
              {field.options &&
                field.options.map((option) => (
                  <div key={option.value} className="select-option">
                    <div className="checkbox"></div>
                    <div className="option-label">{option.label}</div>
                  </div>
                ))}
            </div>
            {field.helperText && (
              <div className="field-helper">{field.helperText}</div>
            )}
          </div>
        );

      default:
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>
            <div className="field-unsupported">
              Unsupported field type: {field.type}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="phone-outer-frame">
      <div className="phone-frame">
        <div className="preset-detail">
          <div className="preset-header">
            <button className="back-button" onClick={() => navigate("/")}>
              ←
            </button>
            <div className="preset-title">
              {loading
                ? "Loading..."
                : preset
                  ? preset.name
                  : "Preset not found"}
            </div>
            <div className="done-button" onClick={() => navigate("/")}>
              Done
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : preset ? (
            <div className="preset-fields">
              {fields.map((field) => (
                <div key={field.tagKey || field.key} className="field">
                  {renderField(field)}
                </div>
              ))}
            </div>
          ) : (
            <div className="not-found">Preset not found</div>
          )}
        </div>
        <div className="bottom-circle"></div>
      </div>
    </div>
  );
};

export default PresetDetail;
