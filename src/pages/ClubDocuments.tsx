import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useClubs, useAdminClubEvents } from "@/hooks/use-dashboard-api";
import { FolderOpen } from "lucide-react";
import { EventDocCard } from "@/components/documents/EventDocCard";

const ClubDocuments = () => {
  const { data: clubs, isLoading: clubsLoading } = useClubs();
  const [selectedClubId, setSelectedClubId] = useState("");
  const { data: clubEvents, isLoading: eventsLoading } = useAdminClubEvents(selectedClubId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <FolderOpen className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Club Documents</h1>
          <p className="text-sm text-muted-foreground">View event photos, documents & budget proofs per club</p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Select Club</label>
            {clubsLoading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <Select value={selectedClubId} onValueChange={setSelectedClubId}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue placeholder="Choose a club..." />
                </SelectTrigger>
                <SelectContent>
                  {clubs?.map((club) => (
                    <SelectItem key={club._id} value={club._id}>{club.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedClubId && (
        <>
          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
            </div>
          ) : clubEvents?.events?.length ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Showing {clubEvents.events.length} events for <span className="font-medium text-foreground">{clubEvents.club.name}</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clubEvents.events.map((event, i) => (
                  <EventDocCard key={event._id} event={event} index={i} />
                ))}
              </div>
            </div>
          ) : (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center text-muted-foreground">
                No events found for this club.
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default ClubDocuments;
