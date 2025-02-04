import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/charging-sessions");
        setSessions(response.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="heading">Charging Sessions Dashboard</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="table-container">
          <table className="charging-table">
            <thead>
              <tr className="table-header">
                <th className="table-cell">Client ID</th>
                <th className="table-cell">Charger ID</th>
                <th className="table-cell">Start Time</th>
                <th className="table-cell">End Time</th>
                <th className="table-cell">Duration</th>
                <th className="table-cell">Created At</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.csid} className="table-row">
                  <td className="table-cell">{session.clientId}</td>
                  <td className="table-cell">{session.csid}</td>
                  <td className="table-cell">{new Date(session.startTime).toLocaleString()}</td>
                  <td className="table-cell">{session.endTime ? new Date(session.endTime).toLocaleString() : "Ongoing"}</td>
                  <td className="table-cell">{session.duration ? `${session.duration} sec` : "N/A"}</td>
                  <td className="table-cell">{new Date(session.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
