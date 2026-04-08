import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { useReviewProof } from "@/hooks/use-mutations";
import { toast } from "@/hooks/use-toast";

interface ProofReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventName: string;
  action: "approved" | "rejected";
}

export const ProofReviewDialog = ({ open, onOpenChange, eventId, eventName, action }: ProofReviewDialogProps) => {
  const [remarks, setRemarks] = useState("");
  const reviewProof = useReviewProof();

  const handleSubmit = () => {
    reviewProof.mutate(
      { eventId, status: action, remarks },
      {
        onSuccess: () => {
          toast({ title: `Proof ${action}`, description: `${eventName} proof has been ${action}.` });
          setRemarks("");
          onOpenChange(false);
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to review proof.", variant: "destructive" });
        },
      }
    );
  };

  const isApprove = action === "approved";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isApprove ? (
              <CheckCircle className="h-5 w-5 text-status-healthy" />
            ) : (
              <XCircle className="h-5 w-5 text-destructive" />
            )}
            {isApprove ? "Approve" : "Reject"} Proof
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {isApprove ? "Approve" : "Reject"} proof for <span className="font-medium text-foreground">{eventName}</span>
          </p>
          <Textarea
            placeholder={isApprove ? "Optional remarks..." : "Reason for rejection (required)..."}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant={isApprove ? "default" : "destructive"}
            onClick={handleSubmit}
            disabled={(!isApprove && !remarks.trim()) || reviewProof.isPending}
          >
            {reviewProof.isPending ? "Submitting..." : isApprove ? "Approve" : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
