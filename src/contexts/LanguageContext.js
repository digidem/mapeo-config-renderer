import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const LanguageContext = createContext();

const API_ROOT = "/api/catfile";

export function LanguageProvider({ children, catfile = "default" }) {
  const [language, setLanguage] = useState("en");
  const [availableLanguages, setAvailableLanguages] = useState(["en"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const { data } = await axios.get(`${API_ROOT}/${catfile}/languages`);
        setAvailableLanguages(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch languages:", error);
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
