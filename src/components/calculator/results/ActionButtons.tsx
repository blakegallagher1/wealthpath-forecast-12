
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Download, Mail } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ActionButtonsProps {
  onRecalculate: () => void;
  onSendEmail: () => void;
}

const ActionButtons = ({ onRecalculate, onSendEmail }: ActionButtonsProps) => {
  // Handle PDF download
  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "Preparing PDF",
        description: "Please wait while we generate your retirement plan PDF...",
      });

      // Target the results container to capture
      const element = document.getElementById('retirement-results-container');
      if (!element) {
        throw new Error("Could not find results container");
      }

      // Use html2canvas to capture the content
      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save the PDF
      pdf.save('retirement-plan.pdf');
      
      toast({
        title: "PDF Downloaded",
        description: "Your retirement plan has been downloaded as a PDF",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
      <Button onClick={onRecalculate} variant="outline">
        Adjust Inputs
      </Button>
      <div className="flex space-x-4">
        <Button onClick={onSendEmail} variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Email Results
        </Button>
        <Button onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
