import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Send } from "lucide-react";
import AdvisorHeader from "@/components/advisor/AdvisorHeader";
import ClientSummary from "@/components/advisor/ClientSummary";
import ClientFinancialOverview from "@/components/advisor/ClientFinancialOverview";
import ClientNetWorthChart from "@/components/advisor/charts/ClientNetWorthChart";
import ClientRetirementIncomeChart from "@/components/advisor/charts/ClientRetirementIncomeChart";
import ClientCashflowChart from "@/components/advisor/charts/ClientCashflowChart";
import ClientAssetAllocationChart from "@/components/advisor/charts/ClientAssetAllocationChart";
import { Client } from "./AdvisorDashboard";
import { generateMockClients, generateClientData } from "@/lib/advisor/mockData";
import { toast } from "@/components/ui/use-toast";

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [clientData, setClientData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      const mockClients = generateMockClients(15);
      const selectedClient = mockClients.find(c => c.id === clientId) || mockClients[0];
      setClient(selectedClient);
      setClientData(generateClientData(selectedClient));
      setIsLoading(false);
    }, 1000);
  }, [clientId]);

  const handleLogout = () => {
    navigate("/");
  };

  const handleBackClick = () => {
    navigate("/advisor/dashboard");
  };

  const handleSendEmail = () => {
    toast({
      title: "Email sent",
      description: `Retirement report sent to ${client?.email}`,
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: "PDF downloaded",
      description: "Client retirement report has been downloaded",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <AdvisorHeader onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-20">Loading client data...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <AdvisorHeader onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center">
              <Button variant="ghost" onClick={handleBackClick} className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold">{client?.name}</h1>
                <p className="text-neutral-500 mt-1">Client Retirement Plan</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Button variant="outline" onClick={handleSendEmail}>
                <Send className="h-4 w-4 mr-2" />
                Email Report
              </Button>
              <Button onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {client && clientData && (
            <>
              <ClientSummary client={client} clientData={clientData} />

              <Card className="mb-8 mt-8">
                <CardHeader className="pb-3">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full max-w-2xl grid grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="retirement">Retirement</TabsTrigger>
                      <TabsTrigger value="cashflow">Cashflow</TabsTrigger>
                      <TabsTrigger value="assets">Assets</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <TabsContent value="overview" className="space-y-8">
                    <ClientFinancialOverview client={client} clientData={clientData} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Net Worth Projection</CardTitle>
                          <CardDescription>Projected growth over time</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ClientNetWorthChart data={clientData.netWorthData} />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Retirement Income</CardTitle>
                          <CardDescription>Monthly income during retirement</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ClientRetirementIncomeChart data={clientData.incomeData} />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="retirement" className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Retirement Income Sources</CardTitle>
                          <CardDescription>Breakdown of income during retirement years</CardDescription>
                        </CardHeader>
                        <CardContent className="h-96">
                          <ClientRetirementIncomeChart data={clientData.incomeData} showLegend={true} />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Portfolio Longevity</CardTitle>
                          <CardDescription>How long savings will last in retirement</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ClientNetWorthChart data={clientData.netWorthData} variant="longevity" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Social Security Analysis</CardTitle>
                          <CardDescription>Impact of claiming age on benefits</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ClientRetirementIncomeChart data={clientData.socialSecurityData} variant="social-security" />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="cashflow" className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Cashflow Projection</CardTitle>
                          <CardDescription>Income and expenses over time</CardDescription>
                        </CardHeader>
                        <CardContent className="h-96">
                          <ClientCashflowChart data={clientData.cashflowData} />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Current Budget</CardTitle>
                          <CardDescription>Monthly income and expense breakdown</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ClientCashflowChart data={clientData.budgetData} variant="budget" />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Retirement Budget</CardTitle>
                          <CardDescription>Projected retirement monthly expenses</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ClientCashflowChart data={clientData.retirementBudgetData} variant="retirement-budget" />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assets" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Current Asset Allocation</CardTitle>
                          <CardDescription>Distribution of current investments</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ClientAssetAllocationChart data={clientData.currentAssetAllocation} />
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader>
                          <CardTitle>Recommended Asset Allocation</CardTitle>
                          <CardDescription>Optimized investment distribution</CardDescription>
                        </CardHeader>
                        <CardContent className="h-80">
                          <ClientAssetAllocationChart data={clientData.recommendedAssetAllocation} variant="recommended" />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Asset Growth Projection</CardTitle>
                          <CardDescription>Growth of assets over time by category</CardDescription>
                        </CardHeader>
                        <CardContent className="h-96">
                          <ClientNetWorthChart data={clientData.assetGrowthData} variant="asset-categories" />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default ClientDetail;
