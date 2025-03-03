
import { WithdrawalStrategyDataPoint } from "@/lib/calculator/types";

/**
 * Finds the age at which the portfolio is depleted for a given strategy
 * @param data Array of withdrawal strategy data points
 * @param strategy The strategy to analyze ("conservative", "moderate", or "aggressive")
 * @returns The age at which the portfolio is depleted, or null if not depleted
 */
export const findDepletionAge = (
  data: WithdrawalStrategyDataPoint[],
  strategy: "conservative" | "moderate" | "aggressive"
): number | null => {
  // Find first data point where balance is zero or nearly zero (less than $1000)
  const depletionPoint = data.find(point => point[strategy] < 1000);
  return depletionPoint ? depletionPoint.age : null;
};

/**
 * Calculates the longevity of a portfolio in years based on retirement age
 * @param depletionAge The age at which the portfolio is depleted
 * @param retirementAge The age at which retirement begins
 * @returns The number of years the portfolio is expected to last
 */
export const calculateLongevity = (
  depletionAge: number | null,
  retirementAge: number
): number => {
  return depletionAge ? depletionAge - retirementAge : 30;
};

/**
 * Formats a percentage value for display
 * @param value The percentage value to format
 * @returns Formatted percentage string with 1 decimal place
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

/**
 * Formats a currency value for chart tooltips
 * @param value The currency value to format
 * @returns Formatted currency string
 */
export const formatCurrencyForTooltip = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  } else {
    return `$${value.toFixed(0)}`;
  }
};
