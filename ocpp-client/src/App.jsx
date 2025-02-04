
// App.jsx - Handles only routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChargingStations from "./ChargingStations";
import Dashboard from "./Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChargingStations />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
