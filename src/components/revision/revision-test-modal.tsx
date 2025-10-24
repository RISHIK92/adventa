"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { apiService } from "@/services/weaknessApi";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RevisionTestModalProps {
  examId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTestGenerated: (testInstanceId: string) => void;
}

const questionCounts = [10, 20, 30, 60];

export function RevisionTestModal({
  examId,
  open,
  onOpenChange,
  onTestGenerated,
}: RevisionTestModalProps) {
  const { toast } = useToast();
  const [selectedCount, setSelectedCount] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await apiService.generateRevisionTest({
        examId,
        questionCount: selectedCount as 10 | 20 | 30 | 60,
      });
      if (result.testInstanceId) {
        onTestGenerated(result.testInstanceId);
      } else {
        throw new Error(result.error || "Failed to generate test.");
      }
    } catch (error) {
      console.error("Error generating revision test:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description:
          error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a Revision Test</DialogTitle>
          <DialogDescription>
            This test is built from your past mistakes and weakest topics to
            help you improve effectively. Choose the length of your test below.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={String(selectedCount)}
            onValueChange={(value) => setSelectedCount(Number(value))}
            className="grid grid-cols-2 gap-4"
          >
            {questionCounts.map((count) => (
              <div key={count} className="flex items-center space-x-2">
                <RadioGroupItem value={String(count)} id={`r-${count}`} />
                <Label htmlFor={`r-${count}`}>{count} Questions</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Generate Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
