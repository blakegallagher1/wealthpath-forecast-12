
/**
 * Formats numbers in a more controlled way for display
 */
export const formatSummaryValue = (amount: number, decimalPlaces: number = 1) => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(decimalPlaces)}B`;
  } else if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(decimalPlaces)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(decimalPlaces)}K`;
  } else {
    return `$${amount.toFixed(decimalPlaces)}`;
  }
};
