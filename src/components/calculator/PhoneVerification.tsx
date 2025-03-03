
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

interface PhoneVerificationProps {
  onVerify: () => void;
}

const PhoneVerification = ({ onVerify }: PhoneVerificationProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  // Simplified phone number validation
  const isValidPhoneNumber = (phone: string) => {
    return /^\d{10}$/.test(phone.replace(/[^0-9]/g, ""));
  };

  // Countdown timer for resending code
  useEffect(() => {
    if (timeRemaining <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeRemaining]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate sending verification code
  const handleSendCode = () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    
    if (!isValidPhoneNumber(cleanPhone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setCodeSent(true);
      setTimeRemaining(60); // 60 second cooldown for resending
      
      // Generate a random 6-digit code (in a real app this would be sent to the phone)
      const generatedCode = "123456"; // For demo purposes, use fixed code
      
      // In a real app, you would call an API to send an SMS:
      // const response = await fetch('/api/send-verification', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phoneNumber: cleanPhone })
      // });
      
      toast({
        title: "Verification code sent",
        description: `A verification code has been sent to ${phoneNumber}. For demo purposes, use code "123456".`,
      });
      
      console.log(`[DEMO] Verification code for ${phoneNumber}: ${generatedCode}`);
    }, 1500);
  };

  // Simulate verifying code
  const handleVerifyCode = () => {
    setIsSubmitting(true);
    setVerificationAttempts(prev => prev + 1);
    
    // For demo purposes, accept code "123456"
    setTimeout(() => {
      setIsSubmitting(false);
      
      if (verificationCode === "123456") {
        toast({
          title: "Verification successful",
          description: "Your retirement plan calculation is in progress.",
        });
        onVerify();
      } else {
        const remainingAttempts = 3 - verificationAttempts;
        
        if (remainingAttempts <= 0) {
          toast({
            title: "Too many attempts",
            description: "You've exceeded the maximum number of verification attempts. Please try again later.",
            variant: "destructive",
          });
          setCodeSent(false);
          setVerificationAttempts(0);
          setVerificationCode("");
        } else {
          toast({
            title: "Invalid code",
            description: `The verification code you entered is incorrect. ${remainingAttempts} attempts remaining.`,
            variant: "destructive",
          });
        }
      }
    }, 1500);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, "");
    
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Human Verification</CardTitle>
          <CardDescription>
            Please verify your phone number to access the retirement calculator.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!codeSent ? (
            <div className="space-y-3">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="(123) 456-7890"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className="text-base"
              />
              <p className="text-sm text-neutral-500">
                We'll send a verification code to this number.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.slice(0, 6))}
                className="text-base tracking-wider"
                maxLength={6}
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-neutral-500">
                  For demo purposes, please enter <span className="font-semibold">123456</span>
                </p>
                {timeRemaining > 0 && (
                  <p className="text-sm text-neutral-500">
                    Resend in {formatTime(timeRemaining)}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!codeSent ? (
            <Button
              onClick={handleSendCode}
              disabled={!phoneNumber || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Sending..." : "Send Code"}
            </Button>
          ) : (
            <div className="flex w-full flex-col space-y-2">
              <Button
                onClick={handleVerifyCode}
                disabled={verificationCode.length !== 6 || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Verifying..." : "Verify Code"}
              </Button>
              <div className="flex justify-between">
                <Button
                  variant="link"
                  onClick={() => {
                    setCodeSent(false);
                    setVerificationCode("");
                  }}
                  className="text-sm"
                >
                  Change phone number
                </Button>
                {timeRemaining <= 0 && (
                  <Button
                    variant="link"
                    onClick={handleSendCode}
                    disabled={isSubmitting}
                    className="text-sm"
                  >
                    Resend code
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PhoneVerification;
