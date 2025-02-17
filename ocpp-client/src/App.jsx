// App.jsx - Handles only routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChargingStations from "./components/ChargingStations";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout"; // Import Layout component

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ChargingStations />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
