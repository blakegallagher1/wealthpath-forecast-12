
/**
 * Utility functions for chart formatting
 */

// Format currency for tooltips and other displays
export const formatChartCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

// Find depletion age (when balance hits zero or very low)
export const findDepletionAge = (data: any[], key: 'aggressive' | 'moderate' | 'conservative') => {
  // Consider "depleted" when balance falls below 1% of maximum value
  const maxValue = Math.max(...data.map(d => d[key]));
  const threshold = maxValue * 0.01;
  
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i][key] > threshold) {
      return data[i].age;
    }
  }
  return null;
};
