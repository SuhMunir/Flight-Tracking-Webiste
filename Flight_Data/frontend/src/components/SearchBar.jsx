import React, { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input.trim());
  };
  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center", marginBottom: "10px" }}>
      <input
        type="text"
        placeholder="Search by flight call-sign..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ padding: "8px", width: "250px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <button type="submit" style={{ marginLeft: "10px", padding: "8px 12px", borderRadius: "5px",
        border: "none", backgroundColor: "#007bff", color: "#fff" }}>
        Search
      </button>
    </form>
  );
}
