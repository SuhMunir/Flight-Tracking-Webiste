import React, { useState } from "react";
import FlightMap from "./components/FlightMap";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [query, setQuery] = useState("");
  const handleSearch = (value) => setQuery(value);
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>✈️ Flight_Data Live Tracker</h1>
      <SearchBar onSearch={handleSearch} />
      <FlightMap searchQuery={query} />
    </div>
  );
}
