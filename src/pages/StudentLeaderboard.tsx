import { Trophy, Medal, Award, Star, MessageSquare, Camera, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentLeaderboard } from "@/hooks/use-dashboard-api";

const rankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="h-5 w-5 text-primary" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-muted-foreground" />;
  if (rank === 3) return <Award className="h-5 w-5 text-accent-foreground" />;
  return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>;
};

const StudentLeaderboard = () => {
  const { data: leaderboard, isLoading } = useStudentLeaderboard();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-primary">
          <Trophy className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Most active students ranked by participation</p>
        </div>
      </div>

      {/* Scoring legend */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="outline" className="gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> Events Attended × 3
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <MessageSquare className="h-3.5 w-3.5" /> Feedback Given × 2
        </Badge>
        <Badge variant="outline" className="gap-1.5">
          <Camera className="h-3.5 w-3.5" /> Photos Contributed × 1
        </Badge>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Rankings</CardTitle>
          <CardDescription>Score = (Events × 3) + (Feedback × 2) + (Photos × 1)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : !leaderboard?.length ? (
            <p className="text-center py-8 text-muted-foreground">No student data available yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Events</TableHead>
                  <TableHead className="text-center">Feedback</TableHead>
                  <TableHead className="text-center">Photos</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((student, idx) => (
                  <TableRow key={student._id} className={idx < 3 ? "bg-accent/30" : ""}>
                    <TableCell className="text-center">{rankIcon(idx + 1)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{student.eventsAttended}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{student.feedbackGiven}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{student.photosContributed}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Star className="h-4 w-4 text-primary" />
                        <span className="font-bold text-foreground">{student.score}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentLeaderboard;
