import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Clock, Image, FileText, DollarSign, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ProofStatusBadge } from "./ProofStatusBadge";
import { ProofReviewDialog } from "./ProofReviewDialog";
import type { Event } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
const getFileUrl = (path: string) => `${API_BASE}${path}`;

export const EventDocCard = ({ event, index }: { event: Event; index: number }) => {
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected" | null>(null);

  const hasPhotos = (event.photos?.length ?? 0) > 0;
  const hasDocs = (event.documents?.length ?? 0) > 0;
  const hasBudgetProof = (event.budgetProof?.length ?? 0) > 0;
  const canReview = event.proofStatus === "submitted";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-base">{event.name}</CardTitle>
              <ProofStatusBadge status={event.proofStatus} />
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground mt-1">
              <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" /> {event.date}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {event.time}</span>
            </div>
            {event.proofRemarks && (
              <p className="text-xs mt-2 px-2 py-1.5 rounded-md bg-muted text-muted-foreground italic">
                Remarks: {event.proofRemarks}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {(event.budgetUsed ?? 0) > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground font-medium">Budget Used: ₹{event.budgetUsed?.toLocaleString()}</span>
              </div>
            )}

            {hasPhotos && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <Image className="h-3.5 w-3.5" /> Photos ({event.photos!.length})
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {event.photos!.map((photo, j) => (
                    <a key={j} href={getFileUrl(photo)} target="_blank" rel="noopener noreferrer" className="block">
                      <img src={getFileUrl(photo)} alt={`Event photo ${j + 1}`} className="w-full h-20 object-cover rounded-md border hover:opacity-80 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {hasDocs && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Documents ({event.documents!.length})
                </h4>
                <div className="space-y-1">
                  {event.documents!.map((doc, j) => (
                    <a key={j} href={getFileUrl(doc)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline p-1.5 rounded-md hover:bg-accent transition-colors">
                      <FileText className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{doc.split("/").pop()}</span>
                      <ExternalLink className="h-3 w-3 shrink-0 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {hasBudgetProof && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" /> Budget Proofs ({event.budgetProof!.length})
                </h4>
                <div className="space-y-1">
                  {event.budgetProof!.map((proof, j) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(proof);
                    return isImage ? (
                      <a key={j} href={getFileUrl(proof)} target="_blank" rel="noopener noreferrer" className="block">
                        <img src={getFileUrl(proof)} alt={`Budget proof ${j + 1}`} className="w-full h-20 object-cover rounded-md border hover:opacity-80 transition-opacity" />
                      </a>
                    ) : (
                      <a key={j} href={getFileUrl(proof)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-primary hover:underline p-1.5 rounded-md hover:bg-accent transition-colors">
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{proof.split("/").pop()}</span>
                        <ExternalLink className="h-3 w-3 shrink-0 ml-auto" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasPhotos && !hasDocs && !hasBudgetProof && (
              <p className="text-xs text-muted-foreground text-center py-4">No files uploaded for this event yet.</p>
            )}

            {canReview && (
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" className="flex-1 gap-1.5" onClick={() => setReviewAction("approved")}>
                  <CheckCircle className="h-4 w-4" /> Approve
                </Button>
                <Button size="sm" variant="destructive" className="flex-1 gap-1.5" onClick={() => setReviewAction("rejected")}>
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {reviewAction && (
        <ProofReviewDialog
          open={!!reviewAction}
          onOpenChange={(open) => !open && setReviewAction(null)}
          eventId={event._id}
          eventName={event.name}
          action={reviewAction}
        />
      )}
    </>
  );
};
