
import DefaultNetWorthChart from "./variants/DefaultNetWorthChart";
import LongevityNetWorthChart from "./variants/LongevityNetWorthChart";
import AssetCategoriesChart from "./variants/AssetCategoriesChart";

interface ClientNetWorthChartProps {
  data: any[];
  variant?: "default" | "longevity" | "asset-categories";
}

const ClientNetWorthChart = ({ data, variant = "default" }: ClientNetWorthChartProps) => {
  switch (variant) {
    case "longevity":
      return <LongevityNetWorthChart data={data} />;
    case "asset-categories":
      return <AssetCategoriesChart data={data} />;
    default:
      return <DefaultNetWorthChart data={data} />;
  }
};

export default ClientNetWorthChart;
