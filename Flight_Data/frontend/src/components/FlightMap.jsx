import React, { useEffect, useRef, useState } from "react";

const GOOGLE_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

export default function FlightMap({ searchQuery }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const existingScript = document.getElementById("google-maps");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-maps";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  const initMap = () => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 51.5, lng: 0 },
      zoom: 6,
      mapTypeId: "terrain"
    });
    fetchFlights();
  };

  const fetchFlights = async () => {
    try {
      const response = await fetch("/api/flights");
      const json = await response.json();
      setFlights(json.data.states || []);
      renderMarkers(json.data.states || []);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchFlights, 20000);
    return () => clearInterval(interval);
  }, []);

  const renderMarkers = (states) => {
    if (!mapInstance.current || !window.google) return;
    if (mapInstance.current.markers) {
      mapInstance.current.markers.forEach((m) => m.setMap(null));
    }
    const filtered = searchQuery
      ? states.filter((s) => (s[1] || '').toLowerCase().includes(searchQuery.toLowerCase()))
      : states;
    const markers = filtered.filter((s) => s[6] && s[5]).map((s) => {
      const marker = new window.google.maps.Marker({
        position: { lat: s[6], lng: s[5] },
        map: mapInstance.current,
        title: (s[1] || "Unknown").trim()
      });
      const info = new window.google.maps.InfoWindow({
        content: `<div><strong>${(s[1] || "Unknown").trim()}</strong><br/>Altitude: ${s[7]} m<br/>Velocity: ${s[9]} m/s<br/>Country: ${s[2] || "N/A"}</div>`
      });
      marker.addListener("click", () => info.open(mapInstance.current, marker));
      return marker;
    });
    mapInstance.current.markers = markers;
  };

  return <div ref={mapRef} style={{ width: "100%", height: "80vh", border: "1px solid #ccc", borderRadius: "10px" }}></div>;
}
