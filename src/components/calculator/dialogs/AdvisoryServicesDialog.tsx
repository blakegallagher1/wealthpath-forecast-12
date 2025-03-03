
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface AdvisoryServicesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdvisoryServicesDialog = ({ open, onOpenChange }: AdvisoryServicesDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">You Qualify for Premium Advisory Services</DialogTitle>
          <DialogDescription className="text-center pt-2">
            It seems you have the minimum assets necessary to qualify for the financial advisory services of the Hoffman Private Wealth Group. Would you like to speak with an expert?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-3 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Our wealth management experts can provide personalized guidance to help optimize your retirement strategy and maximize your financial potential.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2 w-full"
            onClick={() => window.open("https://todd-hoffman.stewardpartners.com/", "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Learn More
          </Button>
          <Button 
            className="flex items-center gap-2 w-full"
            onClick={() => window.open("https://calendly.com/andy-hoffman-stewardpartners/15min", "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Schedule a Call
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdvisoryServicesDialog;
