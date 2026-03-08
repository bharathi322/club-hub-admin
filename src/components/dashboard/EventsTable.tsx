import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEvents } from "@/hooks/use-dashboard-api";
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/hooks/use-mutations";
import { Skeleton } from "@/components/ui/skeleton";
import EventFormDialog from "./EventFormDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/api";

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  approved: "default",
  pending: "secondary",
  warning: "destructive",
};

const EventsTable = () => {
  const { data: events, isLoading } = useEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();
  const { toast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = (data: Partial<Event> & { id?: string }) => {
    const mutation = data.id ? updateEvent : createEvent;
    mutation.mutate(data as any, {
      onSuccess: () => {
        setFormOpen(false);
        setEditingEvent(null);
        toast({ title: data.id ? "Event updated" : "Event created" });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" });
      },
    });
  };

  const handleDelete = () => {
    if (!deletingId) return;
    deleteEvent.mutate(deletingId, {
      onSuccess: () => {
        setDeleteOpen(false);
        setDeletingId(null);
        toast({ title: "Event deleted" });
      },
      onError: (err: any) => {
        toast({ title: "Error", description: err.response?.data?.message || "Failed", variant: "destructive" });
      },
    });
  };

  return (
    <>
      <Card className="shadow-card">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">Events Overview</CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 h-7 text-xs"
            onClick={() => { setEditingEvent(null); setFormOpen(true); }}
          >
            <Plus className="h-3 w-3" /> Add Event
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : events?.length ? (
                events.map((e) => (
                  <TableRow key={e._id}>
                    <TableCell className="font-medium">{e.name}</TableCell>
                    <TableCell className="text-muted-foreground">{e.club}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[e.status] || "secondary"} className="capitalize">{e.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">{e.rating || "--"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setEditingEvent(e); setFormOpen(true); }}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => { setDeletingId(e._id); setDeleteOpen(true); }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-6">No events found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EventFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        onSubmit={handleSubmit}
        isLoading={createEvent.isPending || updateEvent.isPending}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteEvent.isPending}
      />
    </>
  );
};

export default EventsTable;
