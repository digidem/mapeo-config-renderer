import { useLanguage } from "../contexts/LanguageContext";
import "./Heading.css";

export default function Heading() {
  const { language, setLanguage, availableLanguages, loading } = useLanguage();

  const handleGoHome = () => {
    window.location.href = "/#/";
  };

  return (
    <header>
      <div className="header-title">
        <h2>Comapeo categories viewer</h2>
        <button className="home-button" onClick={handleGoHome}>
          ← Default
        </button>
      </div>
      <div className="header-controls">
        <fieldset className="language-selector" disabled={loading}>
          <legend>Language:</legend>
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
        <form action="/upload/" method="POST" encType="multipart/form-data">
          <label htmlFor="file">Upload .comapeocat file:</label>
          <input
            type="file"
            id="file"
            name="categories"
            accept=".comapeocat"
            required
          />
          <button type="submit">Upload</button>
        </form>
      </div>
    </header>
  );
}
