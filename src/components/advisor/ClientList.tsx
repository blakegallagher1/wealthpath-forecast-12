
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Client } from "@/pages/AdvisorDashboard";
import { ChevronRight, Eye } from "lucide-react";

interface ClientListProps {
  clients: Client[];
  onClientClick: (clientId: string) => void;
}

const ClientList = ({ clients, onClientClick }: ClientListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "completed":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (clients.length === 0) {
    return <div className="text-center py-8 text-gray-500">No clients found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Retirement Age</TableHead>
            <TableHead className="hidden md:table-cell">Current Savings</TableHead>
            <TableHead className="hidden md:table-cell">Success Rate</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="hover:bg-neutral-50">
              <TableCell className="font-medium">
                <div>{client.name}</div>
                <div className="text-sm text-neutral-500">{client.email}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusColor(client.status)}>
                  {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">{client.retirementAge}</TableCell>
              <TableCell className="hidden md:table-cell">{formatCurrency(client.currentSavings)}</TableCell>
              <TableCell className="hidden md:table-cell">
                <span className={client.successProbability >= 80 ? "text-green-600" : 
                                client.successProbability >= 60 ? "text-amber-600" : "text-red-600"}>
                  {client.successProbability}%
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onClientClick(client.id)}>
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">View</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClientList;
