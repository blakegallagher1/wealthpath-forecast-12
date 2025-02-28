
import { Card, CardContent } from "@/components/ui/card";
import { Client } from "@/pages/AdvisorDashboard";
import { Calendar, Mail, Phone, DollarSign, BadgePercent, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ClientSummaryProps {
  client: Client;
  clientData: any;
}

const ClientSummary = ({ client, clientData }: ClientSummaryProps) => {
  const getSuccessRatingText = (probability: number) => {
    if (probability >= 80) return "Excellent";
    if (probability >= 60) return "Good";
    if (probability >= 40) return "Fair";
    return "Needs Attention";
  };

  const getSuccessRatingColor = (probability: number) => {
    if (probability >= 80) return "text-green-600";
    if (probability >= 60) return "text-amber-600";
    if (probability >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">Client Information</h3>
                <p className="text-sm text-neutral-500">Contact & personal details</p>
              </div>
              <Badge variant="outline" className={
                client.status === "new" ? "bg-blue-100 text-blue-800" :
                client.status === "active" ? "bg-green-100 text-green-800" :
                client.status === "pending" ? "bg-amber-100 text-amber-800" :
                "bg-purple-100 text-purple-800"
              }>
                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-neutral-500" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-neutral-500" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                <span>Last Contact: {client.lastContact}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <div className="text-sm font-medium">Tags</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {client.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-neutral-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Retirement Overview</h3>
              <p className="text-sm text-neutral-500">Financial goals and timeline</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <span className="text-neutral-600">Current Progress</span>
                  <span className="font-medium">{Math.round((client.currentSavings / client.retirementGoal) * 100)}%</span>
                </div>
                <Progress value={(client.currentSavings / client.retirementGoal) * 100} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-500">Current Savings</div>
                  <div className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-neutral-600" />
                    {formatCurrency(client.currentSavings)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Monthly Contribution</div>
                  <div className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-neutral-600" />
                    {formatCurrency(client.monthlyContribution)}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-neutral-500">Retirement Goal</div>
                  <div className="text-lg font-semibold flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-neutral-600" />
                    {formatCurrency(client.retirementGoal)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-500">Retirement Age</div>
                  <div className="text-lg font-semibold flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-neutral-600" />
                    {client.retirementAge}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Plan Success Rate</h3>
              <p className="text-sm text-neutral-500">Retirement plan health</p>
            </div>
            
            <div className="text-center py-2">
              <div className={`text-3xl font-bold ${getSuccessRatingColor(client.successProbability)}`}>
                {client.successProbability}%
              </div>
              <div className={`text-sm font-medium mt-1 ${getSuccessRatingColor(client.successProbability)}`}>
                {getSuccessRatingText(client.successProbability)}
              </div>
              <div className="mt-4">
                <Progress value={client.successProbability} className="h-2" 
                  indicatorClassName={
                    client.successProbability >= 80 ? "bg-green-500" :
                    client.successProbability >= 60 ? "bg-amber-500" :
                    client.successProbability >= 40 ? "bg-orange-500" : "bg-red-500"
                  }
                />
              </div>
            </div>
            
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">Portfolio Longevity</div>
                <div className="text-sm font-medium">Age {clientData.portfolioLongevity}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Retirement Income</div>
                <div className="text-sm font-medium">{formatCurrency(clientData.monthlyRetirementIncome)}/mo</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Income Replacement</div>
                <div className="text-sm font-medium">{clientData.incomeReplacementRate}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSummary;
