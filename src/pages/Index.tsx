
import { Button } from "@/components/ui/button";
import Calculator from "@/components/calculator/Calculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/advisor/login")}
            className="flex items-center gap-1"
          >
            <LockKeyhole className="h-4 w-4" />
            Advisor Login
          </Button>
        </div>
        <Calculator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
