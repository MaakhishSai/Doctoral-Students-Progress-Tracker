import React, { useState, useEffect } from 'react';
import Layout from '@/components/student/layout/Layout';
import {
  Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';

// =============== FRONT-END STARTS HERE ===============
const Exam = () => {
  const [activeTab, setActiveTab] = useState('announcements');
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // 1) Student info: get rollNo from user’s email (placeholder)
  const currentStudent = {
    name: 'Manhaas',
    // Suppose you stored the roll no in localStorage after login:
    rollNo: localStorage.getItem("rollNoFromEmail") || "P220545CS"
  };

  // 2) Announcements from /api/exams
  const [announcements, setAnnouncements] = useState([]);

  // 3) Student’s applications from /api/applications/student/{rollNo}
  const [applications, setApplications] = useState([]);

  // 4) For specialized syllabi (multiple text boxes)
  const [specializedSyllabi, setSpecializedSyllabi] = useState(['']);

  // ========== EXAMPLE STUDENT RESULTS (unchanged) ==========
  const studentResults = [
    { id: 1, rollNo: 'P210545CS', coreMarks: 16, specializationMarks: 72, totalMarks: 88, status: 'Pass', semester: 'Sem 1' },
    { id: 2, rollNo: 'P220545CS', coreMarks: 14, specializationMarks: 68, totalMarks: 82, status: 'Pass', semester: 'Sem 2' },
    { id: 3, rollNo: 'P230545CS', coreMarks: 10, specializationMarks: 24, totalMarks: 34, status: 'Fail', semester: 'Sem 3' },
  ];

  // ========== LOAD EXAMS & APPLICATIONS ON MOUNT ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Get all exam announcements
        const examRes = await fetch("http://localhost:8080/api/exams");
        if (!examRes.ok) throw new Error("Failed to fetch exams");
        const examData = await examRes.json();

        // Map them to your desired shape
        const mappedExams = examData.map((exam) => ({
          id: exam.id,
          examName: exam.name,
          examDate: exam.examDate,
          subject: exam.examVenue || "N/A",
          registrationDeadline: exam.deadline,
          isOpen: exam.broadcast,
        }));
        setAnnouncements(mappedExams);

        // 2) Get student’s existing applications
        const appsRes = await fetch(`http://localhost:8080/api/applications/student/${currentStudent.rollNo}`);
        if (!appsRes.ok) throw new Error("Failed to fetch student's applications");
        const appsData = await appsRes.json();
        // appsData might look like: [{ id, examId, studentRollNo, status, specializedSyllabi, ... }, ...]
        setApplications(appsData);

      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    fetchData();
  }, [currentStudent.rollNo]);

  // ========== Handle "Apply" Button ==========
  const handleApply = (exam) => {
    setSelectedExam(exam);
    setShowApplyDialog(true);
    // Reset the specialized syllabi array
    setSpecializedSyllabi(['']);
  };

  // ========== POST the new application ==========
  const handleConfirmApplication = async () => {
    if (!selectedExam) return;

    try {
      const response = await fetch("http://localhost:8080/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: selectedExam.id,
          studentName: currentStudent.name,
          studentRollNo: currentStudent.rollNo,
          specializedSyllabi,
          status: "SUBMITTED"  // default status
        }),
      });

      if (!response.ok) throw new Error("Failed to submit application");

      toast.success(`Successfully applied for ${selectedExam.examName}`);
      setShowApplyDialog(false);

      // Optionally re-fetch the student's applications so the UI updates
      const updatedApps = await fetch(`http://localhost:8080/api/applications/student/${currentStudent.rollNo}`);
      if (updatedApps.ok) {
        setApplications(await updatedApps.json());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  // ========== Specialized Syllabus Fields ==========
  const handleAddSyllabusField = () => {
    setSpecializedSyllabi((prev) => [...prev, '']);
  };

  const handleSyllabusChange = (index, value) => {
    setSpecializedSyllabi((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  // ========== "Draft / Submitted / Approved / Rejected" TABS ==========

  // 1) For each exam, see if there's an application. If not => DRAFT
  //    If yes => use that application's status.
  const getExamStatus = (examId) => {
    const app = applications.find((a) => a.examId === examId);
    if (!app) return "DRAFT"; 
    return app.status || "SUBMITTED";
  };

  // 2) Group them by status
  const draftExams = announcements.filter(e => getExamStatus(e.id) === "DRAFT");
  const submittedExams = announcements.filter(e => getExamStatus(e.id) === "SUBMITTED");
  const approvedExams = announcements.filter(e => getExamStatus(e.id) === "APPROVED");
  const rejectedExams = announcements.filter(e => getExamStatus(e.id) === "REJECTED");

  // ========== Student Results Logic (unchanged) ==========
  const [selectedSemester, setSelectedSemester] = useState('');
  const semesterGroups = studentResults.reduce((acc, result) => {
    if (!acc[result.semester]) acc[result.semester] = [];
    acc[result.semester].push(result);
    return acc;
  }, {});
  const semesters = Object.keys(semesterGroups);
  const displaySemester = selectedSemester || (semesters.length > 0 ? semesters[0] : '');
  const displayResults = semesterGroups[displaySemester] || [];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Comprehensive Exam Management
        </h1>

        {/* ========== MAIN TABS: Announcements / Apply / Results ========== */}
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

          {/* =================== ANNOUNCEMENTS TAB =================== */}
          <TabsContent value="announcements" className="mt-6">
            
            {/* SECONDARY TABS: DRAFT / SUBMITTED / APPROVED / REJECTED */}
            <Tabs defaultValue="draft" className="mt">
              <TabsList>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="submitted">Submitted</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              {/* Draft Exams */}
              <TabsContent value="draft" className="mt-4">
                {draftExams.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {draftExams.map((exam) => (
                      <Card key={exam.id} className="card-transition">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{exam.examName}</CardTitle>
                            <Badge variant="secondary">Draft</Badge>
                          </div>
                          <CardDescription>{exam.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Exam Date:</span>
                              <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Registration Deadline:</span>
                              <span>{new Date(exam.registrationDeadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button onClick={() => handleApply(exam)}>
                            Apply Now
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-4">No draft exams.</p>
                )}
              </TabsContent>

              {/* Submitted Exams */}
              <TabsContent value="submitted" className="mt-4">
                {submittedExams.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {submittedExams.map((exam) => (
                      <Card key={exam.id} className="card-transition">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{exam.examName}</CardTitle>
                            <Badge variant="default">Submitted</Badge>
                          </div>
                          <CardDescription>{exam.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Exam Date:</span>
                              <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Registration Deadline:</span>
                              <span>{new Date(exam.registrationDeadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button disabled>Pending Approval</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-4">No submitted exams.</p>
                )}
              </TabsContent>

              {/* Approved Exams */}
              <TabsContent value="approved" className="mt-4">
                {approvedExams.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {approvedExams.map((exam) => (
                      <Card key={exam.id} className="card-transition">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{exam.examName}</CardTitle>
                            <Badge variant="default">Approved</Badge>
                          </div>
                          <CardDescription>{exam.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Exam Date:</span>
                              <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Registration Deadline:</span>
                              <span>{new Date(exam.registrationDeadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button disabled>Approved</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-4">No approved exams.</p>
                )}
              </TabsContent>

              {/* Rejected Exams */}
              <TabsContent value="rejected" className="mt-4">
                {rejectedExams.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {rejectedExams.map((exam) => (
                      <Card key={exam.id} className="card-transition">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle>{exam.examName}</CardTitle>
                            <Badge variant="destructive">Rejected</Badge>
                          </div>
                          <CardDescription>{exam.subject}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium">Exam Date:</span>
                              <span>{new Date(exam.examDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Registration Deadline:</span>
                              <span>{new Date(exam.registrationDeadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button disabled>Rejected</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-4">No rejected exams.</p>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* =================== APPLY TAB =================== */}
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
                              <p className="text-sm text-muted-foreground">
                                {announcement.subject}
                              </p>
                              <div className="flex flex-col md:flex-row gap-4 mt-2">
                                <span className="text-sm">
                                  <span className="font-medium">Exam Date:</span>{" "}
                                  {new Date(announcement.examDate).toLocaleDateString()}
                                </span>
                                <span className="text-sm">
                                  <span className="font-medium">Deadline:</span>{" "}
                                  {new Date(announcement.registrationDeadline).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <Button onClick={() => handleApply(announcement)}>
                              Apply Now
                            </Button>
                          </div>
                        </Card>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        There are no open exam registrations at this time.
                      </p>
                      <p className="text-sm mt-2">
                        Please check the Exam Announcements tab for upcoming exams.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =================== RESULTS TAB =================== */}
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
                    <p className="text-muted-foreground">
                      No results available for {displaySemester}.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* =================== APPLY DIALOG =================== */}
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

                {/* Specialized Syllabi Textareas */}
                <div className="border-t pt-4 mt-4">
                  <p className="font-medium text-sm mb-2">
                    Specialized Subjects Syllabus
                  </p>
                  {specializedSyllabi.map((syllabus, index) => (
                    <textarea
                      key={index}
                      value={syllabus}
                      onChange={(e) => handleSyllabusChange(index, e.target.value)}
                      className="w-full p-2 mb-2 border rounded-md text-sm"
                      placeholder="Paste your specialized subject's syllabus here..."
                    />
                  ))}
                  <Button
                    variant="outline"
                    className="text-sm"
                    onClick={handleAddSyllabusField}
                  >
                    + Add Another Syllabus
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground border-t pt-4 mt-4">
                  <p>By applying, you confirm that you meet all the requirements for this comprehensive exam.</p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApplyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmApplication}>
                Confirm Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Exam;
