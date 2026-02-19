import { useLanguage } from "../contexts/LanguageContext";
import "./Heading.css";

export default function Heading() {
  const { language, setLanguage, availableLanguages, loading } = useLanguage();

  return (
    <header>
      <h2>Comapeo categories viewer</h2>
      <div className="header-controls">
        <div className="language-selector">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
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
        </div>
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
