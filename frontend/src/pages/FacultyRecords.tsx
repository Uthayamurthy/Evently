import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FileSearch, MapPin, CalendarDays, Search, CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function FacultyRecords() {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [records, setRecords] = useState<ODRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.od.getByMonth(parseInt(year), parseInt(month));
      setRecords(data);
    } catch (error) {
      console.error('Failed to load records:', error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  return (
    <div className="p-8 h-full overflow-auto">
      <div className="flex flex-col gap-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Approved OD Records</h2>
          <p className="text-muted-foreground mt-2">
            Look up previously approved or rejected On-Duty records by month.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Records</CardTitle>
            <CardDescription>Select a year and month to view historical processed requests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="grid gap-2 w-full sm:w-[150px]">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="rounded-md"
                  min="2000"
                  max="2100"
                />
              </div>
              <div className="grid gap-2 w-full sm:w-[200px]">
                <Label htmlFor="month">Month</Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Select Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} className="w-full sm:w-auto mt-4 sm:mt-0" disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? "Searching..." : "Search"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {searched && (
          <Card>
             <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Found {records.length} processed request(s) for the selected period.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px]">Student Details</TableHead>
                    <TableHead>Event Info</TableHead>
                    <TableHead className="w-[200px]">Date & Location</TableHead>
                    <TableHead className="text-right">Status</TableHead>
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
                        <TableCell className="text-right flex justify-end">
                           <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : records.length === 0 ? (
                    <TableRow>
                       <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileSearch className="h-8 w-8 text-muted-foreground/50" />
                            <p>No processed OD records found for this period.</p>
                          </div>
                       </TableCell>
                    </TableRow>
                  ) : (
                    records.map((record) => (
                      <TableRow key={record.id} className="group">
                        <TableCell>
                          <div className="font-medium text-slate-900">{record.studentName}</div>
                          <div className="text-sm text-muted-foreground font-mono mt-1">
                            {record.studentRollNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{record.eventName}</div>
                          <div className="text-sm text-muted-foreground max-w-[300px] truncate mt-1">
                            {record.eventDescription}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                             <div className="flex items-center text-sm font-medium text-slate-700">
                               <CalendarDays className="mr-2 h-4 w-4 text-slate-400" />
                               {record.eventDate}
                             </div>
                             <div className="flex items-center text-sm text-muted-foreground">
                               <MapPin className="mr-2 h-4 w-4 text-slate-400" />
                               <span className="truncate max-w-[150px]">{record.eventLocation}</span>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                            {record.status === 'APPROVED' ? (
                               <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex inline-flex items-center gap-1 border-green-200 ml-auto w-fit">
                                  <CheckCircle className="h-3 w-3" /> Approved
                               </Badge>
                            ) : record.status === 'REJECTED' ? (
                                <Badge className="bg-red-100 text-red-800 hover:bg-red-100 flex inline-flex items-center gap-1 border-red-200 ml-auto w-fit">
                                    <XCircle className="h-3 w-3" /> Rejected
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="ml-auto w-fit border-slate-300">
                                    {record.status}
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
        )}
      </div>
    </div>
  );
}