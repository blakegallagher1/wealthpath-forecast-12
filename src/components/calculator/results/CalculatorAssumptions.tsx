
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CalculatorAssumptions = () => {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Calculator Assumptions & Methodology</CardTitle>
        <CardDescription>
          Understanding how we calculate your retirement projections
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="investment-returns">
            <AccordionTrigger>Investment Return Assumptions</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Default investment return rate is 7% annually (customizable)</li>
                <li>Investment returns are compounded annually in all projections</li>
                <li>Risk profiles assume different return rates: conservative (~3-4%), moderate (~4.5-5.5%), and aggressive (~6-7%)</li>
                <li>Real-world market cycles and volatility are simulated in the risk profile analysis</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="inflation">
            <AccordionTrigger>Inflation Modeling</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Default inflation rate is 2.5% annually, affecting purchasing power over time</li>
                <li>Retirement withdrawals are adjusted for inflation each year</li>
                <li>Real estate values are assumed to appreciate at the specified rate (default 3%)</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="social-security">
            <AccordionTrigger>Social Security Calculations</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Benefits estimated using a simplified version of the Social Security Administration's formula</li>
                <li>Uses Average Indexed Monthly Earnings (AIME) based on your current income</li>
                <li>Benefits calculated for both primary earner and spouse if applicable</li>
                <li>Early claiming (age 62) reduces benefits, while delayed claiming (up to age 70) increases them</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="withdrawal">
            <AccordionTrigger>Withdrawal Strategies</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>The "4% Rule" is used as the moderate withdrawal strategy benchmark</li>
                <li>Conservative strategy uses 3% withdrawal rate with more bonds in the portfolio</li>
                <li>Aggressive strategy uses 5% withdrawal rate with more equities</li>
                <li>Sequence of returns risk is factored in for early retirement years</li>
                <li>Required Minimum Distributions (RMDs) are calculated starting at age 72</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="debt">
            <AccordionTrigger>Debt Payoff Methodology</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Mortgage calculations use standard amortization formulas for a 30-year term</li>
                <li>Student loans are assumed to have a 10-year repayment period</li>
                <li>Auto loans use a 5-year repayment schedule</li>
                <li>Credit card debt assumes an accelerated 2-year payoff strategy</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="life-events">
            <AccordionTrigger>Life Events Impact</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Wedding costs are treated as one-time expenses in the specified year</li>
                <li>Child costs are spread over 18 years per child</li>
                <li>Home purchases factor in down payment, mortgage, and appreciation</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="sustainability">
            <AccordionTrigger>Retirement Income Sustainability</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>Sustainability score combines income replacement ratio, withdrawal rate safety, and investment return expectations</li>
                <li>Portfolio longevity calculations factor in inflation, withdrawal rates, and expected returns</li>
                <li>Success probability uses a simplified model that would typically be based on Monte Carlo simulations</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="limitations">
            <AccordionTrigger>Key Limitations</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                <li>The calculator does not account for tax implications of withdrawals</li>
                <li>It uses simplified models rather than full Monte Carlo simulations</li>
                <li>Healthcare costs in retirement may be higher than general inflation</li>
                <li>Market returns are assumed to follow historical patterns, which may not continue</li>
                <li>Life expectancy is based on your inputs rather than actuarial tables</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default CalculatorAssumptions;
