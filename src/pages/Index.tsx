
import { useState } from "react";
import Calculator from "@/components/calculator/Calculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Calculator />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
