
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const AdvisorLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to the dashboard without login
    navigate("/advisor/dashboard");
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Redirecting to Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">Please wait while we redirect you...</div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdvisorLogin;
