
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import AdvisorHeader from "@/components/advisor/AdvisorHeader";
import ClientList from "@/components/advisor/ClientList";
import AdvisorStats from "@/components/advisor/AdvisorStats";
import { generateMockClients } from "@/lib/advisor/mockData";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "new" | "active" | "pending" | "completed";
  lastContact: string;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  retirementGoal: number;
  successProbability: number;
  tags: string[];
}

const AdvisorDashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if advisor is logged in
    const isLoggedIn = localStorage.getItem("advisorLoggedIn") === "true";
    
    if (!isLoggedIn) {
      navigate("/advisor/login");
      return;
    }

    // Load mock data
    setTimeout(() => {
      setClients(generateMockClients(15));
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const filteredClients = clients.filter(client => {
    // Filter by search query
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         client.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by tab
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "new") return matchesSearch && client.status === "new";
    if (activeTab === "pending") return matchesSearch && client.status === "pending";
    if (activeTab === "completed") return matchesSearch && client.status === "completed";
    
    return matchesSearch;
  });

  const handleClientClick = (clientId: string) => {
    navigate(`/advisor/client/${clientId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("advisorLoggedIn");
    localStorage.removeItem("advisorName");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/advisor/login");
  };

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
            <div>
              <h1 className="text-3xl font-bold">Advisor Dashboard</h1>
              <p className="text-neutral-500 mt-1">Manage your clients and their retirement plans</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate("/")}>
                Go to Calculator
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <AdvisorStats clients={clients} />
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Client Activity</CardTitle>
              <CardDescription>
                Overview of your clients and their retirement plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div className="w-full md:w-1/3 mb-4 md:mb-0">
                  <Input
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="new">New</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <Separator className="my-4" />
              
              {isLoading ? (
                <div className="text-center py-8">Loading clients...</div>
              ) : (
                <ClientList 
                  clients={filteredClients} 
                  onClientClick={handleClientClick}
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default AdvisorDashboard;
