import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, CalendarDays, Inbox, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [odRequests, setOdRequests] = useState<ODRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadODs();
  }, []);

  const loadODs = async () => {
    try {
      const data = await api.od.getMyODs();
      setOdRequests(data);
    } catch (error) {
      console.error('Failed to load ODs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Requests</h2>
            <p className="text-muted-foreground mt-2">
              Track the status of your submitted On-Duty applications.
            </p>
          </div>
          <Button onClick={() => navigate('/student/apply')} className="bg-green-600 hover:bg-green-700">
            Apply for OD
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application History</CardTitle>
            <CardDescription>You have applied for {odRequests.length} OD(s) in total.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Event Information</TableHead>
                  <TableHead className="w-[250px]">Date & Location</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
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
                      <TableCell className="text-right flex justify-end">
                         <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : odRequests.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={3} className="h-48 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Inbox className="h-8 w-8 text-muted-foreground/50" />
                          <p>You haven't submitted any OD requests yet.</p>
                        </div>
                     </TableCell>
                  </TableRow>
                ) : (
                  odRequests.map((od) => (
                    <TableRow key={od.id} className="group">
                      <TableCell>
                        <div className="font-medium flex items-center gap-2 text-slate-900">
                           <FileText className="h-4 w-4 text-slate-400" />
                           {od.eventName}
                        </div>
                        <div className="text-sm text-muted-foreground max-w-[300px] truncate mt-1">
                          {od.eventDescription || "No description provided"}
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
                          {od.status === 'APPROVED' ? (
                             <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex inline-flex items-center gap-1 border-green-200 ml-auto w-fit">
                                <CheckCircle className="h-3 w-3" /> Approved
                             </Badge>
                          ) : od.status === 'REJECTED' ? (
                              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex inline-flex items-center gap-1 border-red-200 ml-auto w-fit">
                                  <XCircle className="h-3 w-3" /> Rejected
                              </Badge>
                          ) : (
                              <Badge variant="outline" className="ml-auto w-fit border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                                  Pending
                              </Badge>
                          )}
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