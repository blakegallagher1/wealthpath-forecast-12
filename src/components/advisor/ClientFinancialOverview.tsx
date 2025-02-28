
import { Client } from "@/pages/AdvisorDashboard";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  CheckCircle
} from "lucide-react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface ClientFinancialOverviewProps {
  client: Client;
  clientData: any;
}

const ClientFinancialOverview = ({ client, clientData }: ClientFinancialOverviewProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const determineActionIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "danger":
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case "positive":
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-neutral-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Net Worth</CardTitle>
            <CardDescription>Current financial position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(clientData.currentNetWorth)}</div>
            <div className="text-sm text-green-600 mt-1">
              +{formatCurrency(clientData.netWorthChange)} from last year
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Retirement Outlook</CardTitle>
            <CardDescription>Projected at age {client.retirementAge}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(clientData.projectedRetirementSavings)}</div>
            <div className="text-sm mt-1">
              {formatCurrency(clientData.monthlyRetirementIncome)}/month income
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Investment</CardTitle>
            <CardDescription>Monthly contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(client.monthlyContribution)}</div>
            <div className="text-sm mt-1">
              {clientData.investmentRateOfReturn}% average return
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Key actions to improve retirement outlook</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clientData.recommendations.map((rec: any, index: number) => (
              <div key={index} className="flex">
                <div className="mr-3 mt-0.5">
                  {determineActionIcon(rec.type)}
                </div>
                <div>
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-neutral-600 mt-1">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientFinancialOverview;
