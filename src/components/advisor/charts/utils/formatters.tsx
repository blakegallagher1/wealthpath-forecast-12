
/**
 * Utility functions for chart formatting and display
 */

export const formatCurrencyValue = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
};

export const formatYAxisTick = (value: number) => {
  return `$${Math.abs(value) >= 1000000 ? `${(value / 1000000).toFixed(0)}M` : `${(value / 1000).toFixed(0)}K`}`;
};

export const getRetirementReference = (chartData: any[]) => {
  const retirementEvent = chartData.find(d => d.isRetirementAge);
  return retirementEvent?.year;
};
