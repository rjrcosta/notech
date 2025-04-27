// components/HeatmapLayer.js
import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet.heat';

export default function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatLayer = window.L.heatLayer(points, {
      radius: 35,
      blur: 15,
      maxZoom: 13,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer); // Clean up when component unmounts or points update
    };
  }, [points, map]);

  return null;
}
