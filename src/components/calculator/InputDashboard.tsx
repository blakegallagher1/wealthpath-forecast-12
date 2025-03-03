
import { Button } from "@/components/ui/button";
import { FormInput } from "lucide-react";

const InputDashboard = () => {
  return (
    <div className="pt-4 pb-8">
      <Button 
        variant="outline"
        size="lg"
        className="w-full flex items-center justify-center gap-2 h-16 border-2 bg-blue-50 border-blue-200"
      >
        <FormInput className="h-5 w-5" />
        <div className="flex flex-col items-start">
          <span className="font-medium">Input Dashboard</span>
          <span className="text-xs text-left font-normal">Enter your financial information</span>
        </div>
      </Button>
    </div>
  );
};

export default InputDashboard;
