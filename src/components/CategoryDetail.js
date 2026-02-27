import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CategoryDetail.css";
import { useLanguage } from "../contexts/LanguageContext";

const API_ROOT = "/api/catfile";

const fetchCategory = async (catfile, categoryId, lang) => {
  try {
    const url = `${API_ROOT}/${catfile}/categories/${categoryId}`;
    const { data } = await axios.get(url, { params: { lang } });
    return data;
  } catch (error) {
    console.error("Failed to fetch category: " + categoryId, error);
    return null;
  }
};

const fetchField = async (catfile, fieldId, lang) => {
  try {
    const url = `${API_ROOT}/${catfile}/fields/${fieldId}`;
    const { data } = await axios.get(url, { params: { lang } });
    return data;
  } catch (error) {
    console.error(`Failed to fetch field ${fieldId}:`, error);
    return [];
  }
};

const PresetDetail = () => {
  const { categoryId, catfile } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const categoryData = await fetchCategory(catfile, categoryId, language);
      const fieldsData = await Promise.all(
        categoryData.fields.map(async (fieldId) => {
          return await fetchField(catfile, fieldId, language);
        }),
      );
      setCategory(categoryData);
      setFields(fieldsData);

      setLoading(false);
    };

    fetchData();
  }, [categoryId, catfile, language]);

  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>
            {field.helperText && (
              <div className="field-helper">{field.helperText}</div>
            )}

            <input
              type="text"
              className="field-input"
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
            />
          </div>
        );

      case "number":
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>

            {field.helperText && (
              <div className="field-helper">{field.helperText}</div>
            )}
            <input
              type="number"
              className="field-input"
              placeholder={
                field.placeholder || `Enter ${field.label.toLowerCase()}`
              }
            />
          </div>
        );

      case "selectOne":
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>
            {field.helperText && (
              <div className="field-helper">{field.helperText}</div>
            )}

            <div className="select-options">
              {field.options &&
                field.options.map((option) => (
                  <div key={option.value} className="select-option">
                    <div className="radio-button"></div>
                    <div className="option-label">{option.label}</div>
                  </div>
                ))}
            </div>
          </div>
        );

      case "selectMultiple":
        return (
          <div className="field-container">
            <div className="field-label">{field.label}</div>
            {field.helperText && (
              <div className="field-helper">{field.helperText}</div>
            )}
            <div className="select-options">
              {field.options &&
                field.options.map((option) => (
                  <div key={option.value} className="select-option">
                    <div className="checkbox"></div>
                    <div className="option-label">{option.label}</div>
                  </div>
                ))}
            </div>
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
        <div className="category-detail">
          <div className="category-header">
            <button
              className="back-button"
              onClick={() => navigate(`/catfile/${catfile}`)}
            >
              ←
            </button>
            {loading ? (
              "Loading..."
            ) : category ? (
              <div className="category-title-container">
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <p className="category-title">{category.name}</p>
                  <span className="category-appliest-to">
                    ({category.appliesTo.join(" / ")})
                  </span>
                </div>
                <img
                  className="category-title-icon"
                  src={category.iconPath}
                ></img>
              </div>
            ) : (
              "Preset not found"
            )}
            <div className="done-button" onClick={() => navigate("/")}>
              Done
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : category ? (
            <div className="category-fields">
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
      </div>
    </div>
  );
};

export default PresetDetail;
