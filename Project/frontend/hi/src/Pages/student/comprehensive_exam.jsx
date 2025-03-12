import React, { useState } from 'react';
import Layout from '@/components/student/layout/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';



const Exam = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(undefined);

  // Sample data - would come from API in a real app
  const announcements = [
    {
      id: 1,
      examName: 'Comprehensive Exam - 2023',
      examDate: '2023-05-15',
      subject: 'Computer Science Core and Machine Learning',
      registrationDeadline: '2023-04-30',
      isOpen: false,
    },
    {
      id: 2,
      examName: 'Comprehensive Exam - 2023',
      examDate: '2023-11-20',
      subject: 'Computer Science Core and Data Science',
      registrationDeadline: '2023-10-31',
      isOpen: false,
    },
    {
      id: 3,
      examName: 'Comprehensive Exam - 2024',
      examDate: '2024-05-10',
      subject: 'Computer Science Core and AI',
      registrationDeadline: '2024-04-25',
      isOpen: true,
    },
  ];

  // Current student's exam results
  const studentResults = [
    {
      id: 1,
      rollNo: 'P2105450CS',
      coreMarks: 16,
      specializationMarks: 72,
      totalMarks: 88,
      status: 'Pass',
      semester: 'Sem 1',
    },
    {
      id: 2,
      rollNo: 'P220545CS',
      coreMarks: 14,
      specializationMarks: 68,
      totalMarks: 82,
      status: 'Pass',
      semester: 'Sem 2',
    },
    {
      id: 3,
      rollNo: 'P230545CS',
      coreMarks: 10,
      specializationMarks: 24,
      totalMarks: 34,
      status: 'Fail',
      semester: 'Sem 3',
    },
  ];

  // Current student info
  const currentStudent = {
    name: "Manhaas",
    rollNo: "P220545CS",
  };

  const handleApply = (exam) => {
    setSelectedExam(exam);
    setShowApplyDialog(true);
  };

  const handleConfirmApplication = () => {
    toast.success(`Successfully applied for ${selectedExam?.examName}`);
    setShowApplyDialog(false);
  };

  // Group results by semester
  const semesterGroups = studentResults.reduce((acc, result) => {
    if (!acc[result.semester]) {
      acc[result.semester] = [];
    }
    acc[result.semester].push(result);
    return acc;
  }, {});

  // Get unique semesters for the dropdown
  const semesters = Object.keys(semesterGroups);
  
  // If no semester is selected, use the first one
  const displaySemester = selectedSemester || (semesters.length > 0 ? semesters[0] : '');
  
  // Results to display based on selected semester
  const displayResults = displaySemester ? semesterGroups[displaySemester] || [] : [];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Comprehensive Exam Management</h1>
        
        <Tabs defaultValue="announcements" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Exam Announcements
            </TabsTrigger>
            <TabsTrigger value="apply" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Apply for Exam
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Exam Results
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="announcements" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="card-transition">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{announcement.examName}</CardTitle>
                      <Badge variant={announcement.isOpen ? "default" : "secondary"}>
                        {announcement.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <CardDescription>{announcement.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Exam Date:</span>
                        <span>{new Date(announcement.examDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Registration Deadline:</span>
                        <span>{new Date(announcement.registrationDeadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => handleApply(announcement)} 
                      disabled={!announcement.isOpen}
                      className="w-full"
                    >
                      {announcement.isOpen ? "Apply Now" : "Registration Closed"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="apply" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Apply for Comprehensive Exam</CardTitle>
                <CardDescription>
                  Select an upcoming exam from the list below to submit your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.filter(a => a.isOpen).length > 0 ? (
                    announcements
                      .filter(a => a.isOpen)
                      .map(announcement => (
                        <Card key={announcement.id} className="overflow-hidden">
                          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h3 className="font-medium">{announcement.examName}</h3>
                              <p className="text-sm text-muted-foreground">{announcement.subject}</p>
                              <div className="flex flex-col md:flex-row gap-4 mt-2">
                                <span className="text-sm">
                                  <span className="font-medium">Exam Date:</span> {new Date(announcement.examDate).toLocaleDateString()}
                                </span>
                                <span className="text-sm">
                                  <span className="font-medium">Deadline:</span> {new Date(announcement.registrationDeadline).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button onClick={() => handleApply(announcement)}>Apply Now</Button>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">There are no open exam registrations at this time.</p>
                      <p className="text-sm mt-2">Please check the Exam Announcements tab for upcoming exams.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>My Exam Results</CardTitle>
                <CardDescription>
                  View your comprehensive exam results by semester
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                      <div>
                        <span className="text-sm font-medium">Student Name:</span>
                        <span className="ml-2">{currentStudent.name}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">Roll Number:</span>
                        <span className="ml-2">{currentStudent.rollNo}</span>
                      </div>
                    </div>
                    {semesters.length > 0 && (
                      <div className="w-full md:w-64">
                        <Select 
                          value={displaySemester} 
                          onValueChange={setSelectedSemester}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semesters.map((semester) => (
                              <SelectItem key={semester} value={semester}>
                                {semester}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
                
                {displayResults.length > 0 ? (
                  <div className="space-y-6">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">Core (20)</TableHead>
                            <TableHead className="text-right">Specialization (80)</TableHead>
                            <TableHead className="text-right">Total (100)</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {displayResults.map((result) => (
                            <TableRow key={result.id}>
                              <TableCell className="text-right">{result.coreMarks}</TableCell>
                              <TableCell className="text-right">{result.specializationMarks}</TableCell>
                              <TableCell className="text-right">{result.totalMarks}</TableCell>
                              <TableCell>
                                <Badge variant={result.status === 'Pass' ? 'default' : 'destructive'}>
                                  {result.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No results available for {displaySemester}.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for Comprehensive Exam</DialogTitle>
              <DialogDescription>
                Please confirm your application for the following exam:
              </DialogDescription>
            </DialogHeader>
            
            {selectedExam && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">{selectedExam.examName}</h4>
                  <p className="text-sm text-muted-foreground">{selectedExam.subject}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Exam Date</p>
                    <p>{new Date(selectedExam.examDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Registration Deadline</p>
                    <p>{new Date(selectedExam.registrationDeadline).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground border-t pt-4 mt-4">
                  <p>By applying, you confirm that you meet all the requirements for this comprehensive exam.</p>
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApplyDialog(false)}>Cancel</Button>
              <Button onClick={handleConfirmApplication}>Confirm Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Exam;
