/**
 * Normalize individual heatmap data points
 * @param {Array} data - Array of [lat, lng, value] points
 * @param {Object} options - Optional min and max values
 * @returns {Array} - Normalized array of [lat, lng, normalizedValue]
 */
export function normalizeHeatmapData(data, options = {}) {
    if (!Array.isArray(data) || data.length === 0) return [];
  
    const values = data.map(point => point[2]);
    const min = options.min !== undefined ? options.min : Math.min(...values);
    const max = options.max !== undefined ? options.max : Math.max(...values);
  
    const range = max - min || 1; // Avoid division by zero
  
    return data.map(([lat, lng, value]) => {
      const normalizedValue = (value - min) / range;
      return [lat, lng, normalizedValue];
    });
  }
  
  /**
   * Map original dataset keys to normalized keys
   */
  const keyMapping = {
    soilHumidity: 'soilMoistureData',
    averageFruitSize: 'sizeAverageData',
    soilTemperature: 'soilTemperatureData',
    temperatureData: 'temperatureData',
    humidityData: 'humidityData',
    signalStrengthData: 'signalStrengthData',
  };
  
  /**
   * Normalize multiple heatmap datasets and rename their keys
   * @param {Object} datasets - Object containing multiple datasets
   * @returns {Object} - Normalized datasets with correct key names
   */
  export function normalizeMultipleHeatmapData(datasets) {
    const normalized = {};
  
    for (const key in datasets) {
      const newKey = keyMapping[key] || key; // Fallback to original if no mapping
      normalized[newKey] = normalizeHeatmapData(datasets[key]);
    }
  
    return normalized;
  }
  
  