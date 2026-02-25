import { useLanguage } from "../contexts/LanguageContext";
import "./Heading.css";

export default function Heading() {
  const { language, setLanguage, availableLanguages, loading } = useLanguage();

  return (
    <header>
      <h2>Comapeo categories viewer</h2>
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
