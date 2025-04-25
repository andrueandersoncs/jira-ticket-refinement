"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquarePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type FeedbackType =
  | "user_story"
  | "acceptance_criteria"
  | "testing_guidelines";

export interface FeedbackDialogProps {
  type: FeedbackType;
  content: ReactNode;
  onSubmit: (feedback: string) => Promise<void>;
}

export function FeedbackDialog({
  type,
  content,
  onSubmit,
}: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(feedback);
      setFeedback("");
      setOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          Provide Feedback
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Provide Feedback on {type.replace("_", " ")}
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              Current content:
              <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                {content}
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Textarea
            placeholder="Enter your feedback here..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />
          <Button
            onClick={handleSubmit}
            disabled={!feedback.trim() || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
