import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import IconGrid from "./components/IconGrid";
import PresetDetail from "./components/CategoryDetail.js";
import Heading from "./components/Heading";
import { LanguageProvider } from "./contexts/LanguageContext";

function App() {
  return (
    <div className="App">
      <LanguageProvider>
        <Heading />
        <Router>
          <Routes>
            <Route path="/catfile/:catfile" element={<IconGrid />} />
            <Route path="/" element={<IconGrid />} />
            <Route
              path="/catfile/:catfile/categories/:categoryId"
              element={<PresetDetail />}
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </div>
  );
}

export default App;
