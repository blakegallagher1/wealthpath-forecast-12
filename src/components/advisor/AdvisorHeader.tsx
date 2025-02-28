
import { Button } from "@/components/ui/button";
import { BarChart3, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdvisorHeaderProps {
  onLogout: () => void;
}

const AdvisorHeader = ({ onLogout }: AdvisorHeaderProps) => {
  const navigate = useNavigate();
  const advisorName = localStorage.getItem("advisorName") || "Advisor";

  return (
    <header className="bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2" onClick={() => navigate("/advisor/dashboard")} style={{ cursor: 'pointer' }}>
            <BarChart3 className="h-6 w-6 text-emerald-600" />
            <div className="text-xl font-semibold">Advisor Dashboard</div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex items-center">
              <User className="h-4 w-4 mr-2 text-neutral-500" />
              <span>{advisorName}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdvisorHeader;
