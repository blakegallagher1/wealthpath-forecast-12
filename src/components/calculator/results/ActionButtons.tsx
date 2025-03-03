
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onRecalculate: () => void;
  onSendEmail: () => void;
}

const ActionButtons = ({ onRecalculate, onSendEmail }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
      <Button onClick={onRecalculate} variant="outline">
        Adjust Inputs
      </Button>
      <div className="flex space-x-4">
        <Button onClick={onSendEmail} variant="outline">
          Email Results
        </Button>
        <Button>
          Download PDF
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
