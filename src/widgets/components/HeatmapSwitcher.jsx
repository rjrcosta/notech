import React from 'react';

const HeatmapSwitcher = ({ heatmapTypes, activeHeatmap, setActiveHeatmap }) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] sm:w-50vh w-full flex justify-center pointer-events-none">
      <div className="flex gap-2 overflow-x-auto rounded p-2 shadow pointer-events-auto max-w-md bg-white/0">
        {heatmapTypes.map((type) => (
          <button
            key={type.key}
            onClick={() => setActiveHeatmap(type.key)}
            className={`px-2 whitespace-nowrap rounded ${
              activeHeatmap === type.key
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeatmapSwitcher;
