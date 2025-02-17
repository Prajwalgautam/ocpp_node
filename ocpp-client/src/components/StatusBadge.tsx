import React from "react";

function StatusBadge({ status }) {
  let statusClass = "";

  // Normalize the input to handle different casing and match the cases in the switch
  const normalizedStatus = status ? status.toLowerCase() : "";

  switch (normalizedStatus) {
    case "available":
      statusClass = "bg-green-500 text-black";
      break;
    case "charging":
      statusClass = "bg-yellow-500 text-white";
      break;
    case "out of service":
      statusClass = "bg-red-500 text-white";
      break;
    default:
      statusClass = "bg-gray-500 text-white";
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
