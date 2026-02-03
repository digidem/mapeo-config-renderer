import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IconGrid from "./components/IconGrid";
import PresetDetail from "./components/CategoryDetail.js";
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
            path="/catfile/:catfile/categories/:categoryId"
            element={<PresetDetail />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
