
/**
 * Formats a number as currency in a more controlled way
 */
export const formatCurrency = (amount: number) => {
  const absAmount = Math.abs(amount);
  let formattedValue = "";
  
  if (absAmount >= 1000000000) {
    formattedValue = `$${(absAmount / 1000000000).toFixed(1)}B`;
  } else if (absAmount >= 1000000) {
    formattedValue = `$${(absAmount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    formattedValue = `$${(absAmount / 1000).toFixed(1)}K`;
  } else {
    formattedValue = `$${absAmount.toFixed(0)}`;
  }
  
  // Add negative sign if amount is negative
  return amount < 0 ? `-${formattedValue}` : formattedValue;
};
