import { useEffect, useState } from "react";
import axios from "axios";

const RATE_PER_SECOND = 0.2; // Change this rate as per your requirement

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Charging Sessions Dashboard</h1>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                {[
                  "Client ID",
                  "Charger ID",
                  "Gun ID",
                  "Start Time",
                  "End Time",
                  "Duration",
                  "Cost (NPR)",
                  "Created At"
                ].map((header) => (
                  <th key={header} className="py-3 px-6 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const cost = session.duration ? session.duration * RATE_PER_SECOND : 0;
                return (
                  <tr key={session.csid} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6 text-sm text-gray-700">{session.clientId}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{session.csid}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{session.gunId}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{new Date(session.startTime).toLocaleString()}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">
                      {session.endTime ? new Date(session.endTime).toLocaleString() : "Ongoing"}
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-700">{session.duration ? `${session.duration} sec` : "N/A"}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{cost.toFixed(2)}</td>
                    <td className="py-3 px-6 text-sm text-gray-700">{new Date(session.createdAt).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
