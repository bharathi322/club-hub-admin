import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Send } from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
  submitted: { label: "Submitted", variant: "default" as const, icon: Send },
  approved: { label: "Approved", variant: "healthy" as const, icon: CheckCircle },
  rejected: { label: "Rejected", variant: "destructive" as const, icon: XCircle },
};

export const ProofStatusBadge = ({ status }: { status?: string }) => {
  const config = statusConfig[(status as keyof typeof statusConfig) || "pending"];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};
