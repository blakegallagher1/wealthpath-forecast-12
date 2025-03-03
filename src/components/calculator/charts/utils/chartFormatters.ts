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
  if (!data || data.length === 0) return null;
  
  // Consider "depleted" when balance falls below 1% of maximum value
  const maxValue = Math.max(...data.map(d => d[key]));
  const threshold = maxValue * 0.01;
  
  // Find the last age where balance is above threshold
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i][key] > threshold) {
      // If this is the last data point, the portfolio hasn't depleted
      if (i === data.length - 1) return null;
      // Otherwise return the next age
      return data[i].age;
    }
  }
  
  return null;
};

// Format percent with specified decimal places
export const formatPercent = (value: number, decimals: number = 1) => {
  return `${value.toFixed(decimals)}%`;
};

// Calculate expected longevity given retirement age and depletion age
export const calculateLongevity = (retirementAge: number, depletionAge: number | null) => {
  if (!depletionAge) return "30+ years";
  const longevity = depletionAge - retirementAge;
  return `${longevity} years`;
};
