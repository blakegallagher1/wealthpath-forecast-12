
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RiskProfileChart from "../charts/RiskProfileChart";
import SocialSecurityChart from "../charts/SocialSecurityChart";
import { RetirementPlan } from "@/lib/calculator/types";

interface RiskProfileTabProps {
  plan: RetirementPlan;
}

const RiskProfileTab = ({ plan }: RiskProfileTabProps) => {
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Risk Profile Comparison</CardTitle>
          <CardDescription className="text-sm">
            Projected portfolio growth under different risk profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] px-2 sm:px-6">
          <RiskProfileChart data={plan.riskProfileData} />
        </CardContent>
      </Card>
      
      <Card className="w-full">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Social Security Benefits</CardTitle>
          <CardDescription className="text-sm">
            Projected social security benefits at different claiming ages
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] px-2 sm:px-6">
          <SocialSecurityChart data={plan.socialSecurityData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskProfileTab;
