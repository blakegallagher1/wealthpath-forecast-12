
import React from "react";

interface ResultInfoCardProps {
  title: string;
  value: string;
  description: string;
  emphasis?: "positive" | "neutral" | "negative";
}

const ResultInfoCard = ({ title, value, description, emphasis }: ResultInfoCardProps) => {
  const getValueColorClass = () => {
    switch (emphasis) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      case "neutral":
        return "text-amber-600";
      default:
        return "text-neutral-900";
    }
  };

  return (
    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
      <div className="text-sm text-neutral-500">{title}</div>
      <div className={`text-xl font-medium mt-1 ${getValueColorClass()}`}>{value}</div>
      <div className="text-xs text-neutral-500 mt-1">{description}</div>
    </div>
  );
};

export default ResultInfoCard;
