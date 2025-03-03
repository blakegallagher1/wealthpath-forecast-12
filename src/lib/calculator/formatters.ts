
/**
 * Formats a number as currency in a more controlled way
 * @param amount The amount to format
 * @param precision Optional decimal precision (defaults to 1)
 */
export const formatCurrency = (amount: number, precision: number = 1) => {
  const absAmount = Math.abs(amount);
  let formattedValue = "";
  
  if (absAmount >= 1000000000) {
    formattedValue = `$${(absAmount / 1000000000).toFixed(precision)}B`;
  } else if (absAmount >= 1000000) {
    formattedValue = `$${(absAmount / 1000000).toFixed(precision)}M`;
  } else if (absAmount >= 1000) {
    formattedValue = `$${(absAmount / 1000).toFixed(precision)}K`;
  } else {
    formattedValue = `$${absAmount.toFixed(precision)}`;
  }
  
  // Add negative sign if amount is negative
  return amount < 0 ? `-${formattedValue}` : formattedValue;
};
