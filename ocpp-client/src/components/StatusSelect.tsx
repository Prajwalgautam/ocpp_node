import React from "react";

const StatusSelect = ({ value, onChange, className }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`px-3 py-2 border border-gray-300 rounded-md ${className}`}
    >
      <option value="Available">Available</option>
      <option value="Charging">Charging</option>
      <option value="Out of Service">Out of Service</option>
      {/* Add more options as needed */}
    </select>
  );
};

export default StatusSelect;
