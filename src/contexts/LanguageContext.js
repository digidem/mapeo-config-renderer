import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const LanguageContext = createContext();

const API_ROOT = "/api/catfile";

// Get browser locale, returns language code (e.g., "en", "es", "pt")
function getBrowserLanguage() {
  const locale = navigator.language || navigator.userLanguage || "en";
  // Extract just the language code (e.g., "en-US" -> "en")
  return locale.split("-")[0].toLowerCase();
}

export function LanguageProvider({ children, catfile = "default" }) {
  const [language, setLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState(["en"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data } = await axios.get(`${API_ROOT}/${catfile}/languages`);
        setAvailableLanguages(data);

        // Set language based on browser locale if available, otherwise default to "en"
        const browserLang = getBrowserLanguage();
        if (data.includes(browserLang)) {
          setLanguage(browserLang);
        } else {
          setLanguage("en");
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
        setLanguage("en");
        setLoading(false);
      }
    };
    fetchLanguages();
  }, [catfile]);

  const value = {
    language,
    setLanguage,
    availableLanguages,
    loading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
