import { useEffect, useState } from 'react';
import { api } from '../api';
import type { ODRequest } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, X, MapPin, CalendarDays, Inbox } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FacultyDashboard() {
  const [pendingODs, setPendingODs] = useState<ODRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPendingODs();
  }, []);

  const loadPendingODs = async () => {
    try {
      const data = await api.od.getPending();
      setPendingODs(data);
    } catch (error) {
      console.error('Failed to load pending ODs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.od.approve(id);
      loadPendingODs();
    } catch (error) {
      console.error('Failed to approve OD:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.od.reject(id);
      loadPendingODs();
    } catch (error) {
      console.error('Failed to reject OD:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pending Approvals</h2>
          <p className="text-muted-foreground mt-2">
            Review and manage student OD requests requiring your approval.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <CardDescription>You have {pendingODs.length} request(s) waiting.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[250px]">Student Details</TableHead>
                  <TableHead>Event Info</TableHead>
                  <TableHead className="w-[200px]">Date & Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                      </TableCell>
                      <TableCell>
                         <div className="space-y-2">
                          <Skeleton className="h-4 w-[120px]" />
                          <Skeleton className="h-3 w-[80px]" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                           <Skeleton className="h-9 w-24" />
                           <Skeleton className="h-9 w-24" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : pendingODs.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Inbox className="h-8 w-8 text-muted-foreground/50" />
                          <p>All caught up! No pending requests.</p>
                        </div>
                     </TableCell>
                  </TableRow>
                ) : (
                  pendingODs.map((od) => (
                    <TableRow key={od.id} className="group">
                      <TableCell>
                        <div className="font-medium text-slate-900">{od.studentName}</div>
                        <div className="text-sm text-muted-foreground font-mono mt-1">
                          {od.studentRollNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{od.eventName}</div>
                        <div className="text-sm text-muted-foreground max-w-[300px] truncate mt-1">
                          {od.eventDescription}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center text-sm font-medium text-slate-700">
                             <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
                             {od.eventDate}
                           </div>
                           <div className="flex items-center text-sm text-muted-foreground">
                             <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                             <span className="truncate max-w-[150px]">{od.eventLocation}</span>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(od.id)}
                            disabled={actionLoading === od.id}
                          >
                            {actionLoading === od.id ? (
                              'Processing...'
                            ) : (
                              <>
                                <Check className="mr-1 h-4 w-4" /> Approve
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject(od.id)}
                            disabled={actionLoading === od.id}
                          >
                             {actionLoading === od.id ? (
                              'Processing...'
                            ) : (
                              <>
                                <X className="mr-1 h-4 w-4" /> Reject
                              </>
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
