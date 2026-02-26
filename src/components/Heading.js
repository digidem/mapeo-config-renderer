import { useRef } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import "./Heading.css";

export default function Heading() {
  const { language, setLanguage, availableLanguages, loading } = useLanguage();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const handleGoHome = () => {
    window.location.href = "/#/";
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      formRef.current?.submit();
    }
  };

  const showAsRadio = availableLanguages.length <= 3;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button
          className="nav-button home-button"
          onClick={handleGoHome}
          title="Go to default"
        >
          ←
        </button>
        <h1 className="navbar-title">Comapeo Categories</h1>
      </div>

      <div className="navbar-right">
        {showAsRadio ? (
          <fieldset className="language-selector-radio" disabled={loading}>
            {availableLanguages.map((lang) => (
              <label key={lang} className="language-option">
                <input
                  type="radio"
                  name="language"
                  value={lang}
                  checked={language === lang}
                  onChange={(e) => setLanguage(e.target.value)}
                />
                {lang.toUpperCase()}
              </label>
            ))}
          </fieldset>
        ) : (
          <select
            className="language-selector-dropdown"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={loading}
          >
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        )}

        <form
          ref={formRef}
          action="/upload/"
          method="POST"
          encType="multipart/form-data"
          className="upload-form"
        >
          <input
            ref={fileInputRef}
            type="file"
            name="categories"
            accept=".comapeocat"
            onChange={handleFileChange}
            hidden
          />
          <button
            type="button"
            className="nav-button upload-button"
            onClick={handleUploadClick}
          >
            Upload
          </button>
        </form>
      </div>
    </nav>
  );
}
