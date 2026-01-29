import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IconGrid from "./components/IconGrid";
import PresetDetail from "./components/PresetDetail";
import Heading from "./components/Heading";

function App() {
  return (
    <div className="App">
      <Heading />
      <Router>
        <Routes>
          <Route path="/catfile/:catfile" element={<IconGrid />} />
          <Route path="/" element={<IconGrid />} />
          <Route
            path="/catfile/:catfile/preset/:presetId"
            element={<PresetDetail />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
