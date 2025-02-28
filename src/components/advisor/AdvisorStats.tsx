
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Client } from "@/pages/AdvisorDashboard";
import { Users, Calculator, TrendingUp, BarChart2 } from "lucide-react";

interface AdvisorStatsProps {
  clients: Client[];
}

const AdvisorStats = ({ clients }: AdvisorStatsProps) => {
  // Calculate stats from client data
  const totalClients = clients.length;
  const newClientsCount = clients.filter(client => client.status === "new").length;
  const averageRetirementAge = Math.round(
    clients.reduce((sum, client) => sum + client.retirementAge, 0) / (clients.length || 1)
  );
  const averageSuccessRate = Math.round(
    clients.reduce((sum, client) => sum + client.successProbability, 0) / (clients.length || 1)
  );

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
          <Users className="h-4 w-4 text-neutral-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients}</div>
          <p className="text-xs text-neutral-500 mt-1">
            {newClientsCount} new this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plans Created</CardTitle>
          <Calculator className="h-4 w-4 text-neutral-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalClients + 7}</div>
          <p className="text-xs text-neutral-500 mt-1">
            +5 from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Retirement Age</CardTitle>
          <TrendingUp className="h-4 w-4 text-neutral-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageRetirementAge}</div>
          <p className="text-xs text-neutral-500 mt-1">
            Years old
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Success Rate</CardTitle>
          <BarChart2 className="h-4 w-4 text-neutral-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageSuccessRate}%</div>
          <p className="text-xs text-neutral-500 mt-1">
            +2% from previous
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default AdvisorStats;
