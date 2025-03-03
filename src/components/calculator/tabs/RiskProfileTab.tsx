
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Risk Profile Comparison</CardTitle>
          <CardDescription>
            Projected portfolio growth under different risk profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          <RiskProfileChart data={plan.riskProfileData} />
        </CardContent>
      </Card>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Social Security Benefits</CardTitle>
          <CardDescription>
            Projected social security benefits at different claiming ages
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[500px]">
          <SocialSecurityChart data={plan.socialSecurityData} />
        </CardContent>
      </Card>
    </>
  );
};

export default RiskProfileTab;
