import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IconGrid from "./components/IconGrid";
import PresetDetail from "./components/PresetDetail";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<IconGrid />} />
          <Route path="/preset/:presetId" element={<PresetDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
