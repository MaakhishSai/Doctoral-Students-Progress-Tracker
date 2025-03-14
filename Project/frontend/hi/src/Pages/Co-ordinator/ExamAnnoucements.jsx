import { useState, useEffect,useCallback} from "react";
import { 
  Calendar, 
  Search, 
  Filter, 
  Pencil, 
  Trash2, 
  Plus, 
  Info, 
  ClipboardCheck,
  CheckCircle, 
  XCircle, 
  Clock, 
  AlignLeft,
  Eye
} from "lucide-react";
import FileUpload from "@/components/Co-ordinator/FileUpload";
import DashboardLayout from "@/components/Co-ordinator/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Exam types

const ExamAnnouncement = () => {
  // Common state
  const [activeTab, setActiveTab] = useState("announcements");
  const [loading, setLoading] = useState(true);
  
  // Announcements state
  const [exams, setExams] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  
  // Approved Requests state
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [requestSearchQuery, setRequestSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newStatus, setNewStatus] = useState("pending");
  const [file, setFile] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [courses, setCourses] = useState([]);

  // Approvals related states
  const [approvals, setApprovals] = useState([]);
  const [filteredApprovals, setFilteredApprovals] = useState([]);
//   const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
//   const [searchQuery, setSearchQuery] = useState("");
  const [viewingApproval, setViewingApproval] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
//   const [activeTab, setActiveTab] = useState("upload");
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    deadline: "",
    eligibility: ""
  });
  const [Results, setResults] = useState([]);
  const [isViewing, setIsViewing] = useState(false);
   const handleUpload = useCallback(async () => {
      if (!file) return;
      setIsUploading(true);
  
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const response = await fetch("http://localhost:8080/api/results/upload", {
          method: "POST",
          body: formData,
          mode: 'cors'
        });
  
        if (!response.ok) throw new Error("Failed to upload file");
  
        const data = await response.json();
        setResults(data);
        setUploadSuccess(true); // Hide upload after first submission
        localStorage.setItem("uploadCompleted", "true"); // Prevent upload option from appearing
  
        toast.success("Results data processed", {
          description: `${data.length} Results imported from ${file.name}`,
        });
      } catch (error) {
        toast.error("Error uploading file");
      } finally {
        setIsUploading(false);
      }
    }, [file]);
    const fetchStudents = useCallback(async () => {
      try {
        const response = await fetch("http://localhost:8080/api/results/all");
    
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log("Fetched students:", data);
    
        if (data.length > 0) {
          setResults(data);
          setUploadSuccess(true);
          localStorage.setItem("uploadCompleted", "true");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error(`Fetch error: ${error.message}`);
      }
    }, []);
    useEffect(() => {
      if (localStorage.getItem("uploadCompleted") === "true") {
        fetchStudents();  // Ensure data is fetched on refresh
      }
    }, [fetchStudents]);
    const handleViewStudents = () => {
      setIsViewing(true);
      fetchStudents(); // Ensure fresh data is fetched
    };
  
    const handleSubmit = () => {
      setIsSubmitted(true);
      toast.success("Swayam Results have been submitted", {
        description: `${courses.length} course records have been successfully added to the system.`,
      });
    };
    const handleFileSelect = (selectedFile) => {
      setFile(selectedFile);
      setUploadSuccess(false);
      setIsSubmitted(false);
    };
  useEffect(() => {
    // Load data for both tabs
    const loadAllData = async () => {
      // Simulate loading data
      const mockExams= [
        {
          id: "EX001",
          name: "Comprehensive Exam",
          date: "2025-01-15",
          deadline: "2025-02-15",
        //   eligibility: "Completed at least 3 semesters with CGPA of 8.0 or above",
        },
    
      ];

      const mockRequests= [
        {
          id: "REQ001",
          studentName: "Rahul Kumar",
          rollNumber: "P220780CS",
          examName: "Comprehensive Exam",
          status: "approved",
          approvalDate: "2025-01-15",
        },
        {
          id: "REQ002",
          studentName: "Priya Singh",
          rollNumber: "P230780CS",
          examName: "Comprehensive Exam",
          status: "approved",
          approvalDate: "2025-01-18",
        },
        {
          id: "REQ003",
          studentName: "Amit Patel",
          rollNumber: "P210780CS",
          examName: "Comprehensive Exam",
          status: "pending",
          approvalDate: "",
        },
        {
          id: "REQ004",
          studentName: "Sunita Reddy",
          rollNumber: "P220545CS",
          examName: "Comprehensive Exam",
          status: "rejected",
          approvalDate: "2025-01-10",
        },
        {
          id: "REQ005",
          studentName: "Rajesh Verma",
          rollNumber: "P230545CS",
          examName: "Comprehensive Exam",
          status: "approved",
          approvalDate: "2025-01-20",
        },
      ];

      setExams(mockExams);
      setFilteredExams(mockExams);
      setRequests(mockRequests);
      setFilteredRequests(mockRequests);
      setLoading(false);
    };

    loadAllData();
    
    // Cleanup function
    return () => {
      // Reset states if needed
    };
  }, []);

  // =============== ANNOUNCEMENTS FUNCTIONALITY ===============
  // Apply search filter for exams
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = exams.filter(
        exam =>
          exam.name.toLowerCase().includes(query) ||
          exam.eligibility.toLowerCase().includes(query)
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams(exams);
    }
  }, [searchQuery, exams]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddExam = () => {
    // Validate form
    if (!formData.name || !formData.date || !formData.deadline || !formData.eligibility) {
      toast.error("Please fill all fields", {
        description: "All fields are required to add a new exam."
      });
      return;
    }

    // Create new exam
    const newExam= {
      id: `EX${String(exams.length + 1).padStart(3, '0')}`,
      ...formData
    };

    setExams(prev => [...prev, newExam]);
    
    // Reset form and close dialog
    setFormData({
      name: "",
      date: "",
      deadline: "",
      eligibility: ""
    });
    
    setIsAddDialogOpen(false);
    
    toast.success("Exam added", {
      description: "The exam has been successfully added to the list."
    });
  };

  const handleEditExam = () => {
    if (!selectedExam) return;
    
    // Validate form
    if (!formData.name || !formData.date || !formData.deadline || !formData.eligibility) {
      toast.error("Please fill all fields", {
        description: "All fields are required to update the exam."
      });
      return;
    }

    // Update exam
    setExams(prevExams =>
      prevExams.map(exam =>
        exam.id === selectedExam.id ? { ...exam, ...formData } : exam
      )
    );
    
    // Reset form and close dialog
    setFormData({
      name: "",
      date: "",
      deadline: "",
      eligibility: ""
    });
    
    setIsEditDialogOpen(false);
    setSelectedExam(null);
    
    toast.success("Exam updated", {
      description: "The exam details have been successfully updated."
    });
  };

  const handleDeleteExam = () => {
    if (!selectedExam) return;
    
    // Delete exam
    setExams(prevExams => prevExams.filter(exam => exam.id !== selectedExam.id));
    
    setIsDeleteDialogOpen(false);
    setSelectedExam(null);
    
    toast.success("Exam deleted", {
      description: "The exam has been successfully deleted from the list."
    });
  };

  const openEditDialog = (exam) => {
    setSelectedExam(exam);
    setFormData({
      name: exam.name,
      date: exam.date,
      deadline: exam.deadline,
      eligibility: exam.eligibility
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (exam) => {
    setSelectedExam(exam);
    setIsDeleteDialogOpen(true);
  };

  // =============== APPROVED REQUESTS FUNCTIONALITY ===============
  // Apply filters for requests
  useEffect(() => {
    let filtered = [...requests];
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    // Filter by search query
    if (requestSearchQuery) {
      const query = requestSearchQuery.toLowerCase();
      filtered = filtered.filter(
        request =>
          request.studentName.toLowerCase().includes(query) ||
          request.rollNumber.toLowerCase().includes(query) ||
          request.examName.toLowerCase().includes(query)
      );
    }
    
    setFilteredRequests(filtered);
  }, [statusFilter, requestSearchQuery, requests]);

  const handleUpdateStatus = () => {
    if (!selectedRequest || !newStatus) return;
    
    // Update status
    setRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === selectedRequest.id 
          ? { 
              ...request, 
              status: newStatus, 
              approvalDate: newStatus === "pending" ? "" : new Date().toISOString().split('T')[0]
            } 
          : request
      )
    );
    
    setIsStatusDialogOpen(false);
    
    const statusMessages = {
      approved: "Request approved successfully",
      rejected: "Request rejected",
      pending: "Request marked as pending"
    };
    
    toast.success("Status updated", {
      description: statusMessages[newStatus]
    });
  };

  const openStatusDialog = (request) => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setIsStatusDialogOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} className="text-green-600" />;
      case "rejected":
        return <XCircle size={16} className="text-red-600" />;
      case "pending":
        return <Clock size={16} className="text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-800 border border-green-200",
      rejected: "bg-red-100 text-red-800 border border-red-200",
      pending: "bg-amber-100 text-amber-800 border border-amber-200"
    };
    
    return (
      <div className={cn("px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1", styles[status])}>
        {getStatusIcon(status)}
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
    );
  };

  // =============== COMMON UTILITY FUNCTIONS ===============
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-72 bg-gray-200 rounded-md"></div>
          <div className="h-16 bg-gray-200 rounded-xl"></div>
          <div className="h-80 bg-gray-200 rounded-xl"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex items-center space-x-2 mb-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Comprehensive Exam Management</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Manage comprehensive exams and view student requests for doctoral students
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="announcements" className="text-sm">
              <Calendar className="mr-2 h-4 w-4" />
              Exam Announcements
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-sm">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Approved Exam Requests
            </TabsTrigger>
            <TabsTrigger value="upload" className="text-sm">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Upload Results
            </TabsTrigger>
          </TabsList>

          {/* Exams Announcements Tab */}
          <TabsContent value="announcements" className="pt-4">
            {/* Search and Add */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border mb-8 animate-slide-up">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus size={16} />
                      Announce Exam
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>Announce Comprehensive Exam</DialogTitle>
                      <DialogDescription>
                        Fill in the details to add a new comprehensive exam to the list.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="name" className="text-right">
                          Exam Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., Comprehensive Exam - Machine Learning"
                          className="col-span-3"
                          value={formData.name}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="date" className="text-right">
                          Exam Date
                        </label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          className="col-span-3"
                          value={formData.date}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="deadline" className="text-right">
                          Application Deadline
                        </label>
                        <Input
                          id="deadline"
                          name="deadline"
                          type="date"
                          className="col-span-3"
                          value={formData.deadline}
                          onChange={handleFormChange}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label htmlFor="eligibility" className="text-right">
                          Eligibility Criteria
                        </label>
                        <Input
                          id="eligibility"
                          name="eligibility"
                          placeholder="e.g., Completed at least 3 semesters with CGPA of 8.0 or above"
                          className="col-span-3"
                          value={formData.eligibility}
                          onChange={handleFormChange}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                      <Button onClick={handleAddExam}>Add Exam</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Exams Table */}
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Exam Name</TableHead>
                      <TableHead className="w-[200px]" >Exam Date</TableHead>
                      <TableHead className="w-[300px]">Application Deadline</TableHead>
                      {/* <TableHead className="w-[300px]">Eligibility Criteria</TableHead> */}
                      <TableHead className="w-[200px] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExams.length > 0 ? (
                      filteredExams.map((exam) => (
                        <TableRow key={exam.id} className="group">
                          <TableCell className="w-[400px] font-medium">{exam.name}</TableCell>
                          <TableCell className="w-[200px]">{formatDate(exam.date)}</TableCell>
                          <TableCell className="w-[300px]">{formatDate(exam.deadline)}</TableCell>
                         
                          <TableCell className="w-[200px] items-center">
                          <div className="flex justify-center items-center space-x-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="opacity-50 group-hover:opacity-100 hover:bg-blue-50 text-blue-600"
                                    onClick={() => openEditDialog(exam)}
                                  >
                                    <Pencil size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit exam</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="opacity-50 group-hover:opacity-100 hover:bg-red-50 text-red-600"
                                    onClick={() => openDeleteDialog(exam)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete exam</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            </div>
                          </TableCell>
                          
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Calendar className="h-10 w-10 mb-2" />
                            <h3 className="text-lg font-medium">No exams found</h3>
                            <p className="text-sm">
                              There are no exams matching your search.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Edit Comprehensive Exam</DialogTitle>
                  <DialogDescription>
                    Update the details of the comprehensive exam.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="edit-name" className="text-right">
                      Exam Name
                    </label>
                    <Input
                      id="edit-name"
                      name="name"
                      className="col-span-3"
                      value={formData.name}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="edit-date" className="text-right">
                      Exam Date
                    </label>
                    <Input
                      id="edit-date"
                      name="date"
                      type="date"
                      className="col-span-3"
                      value={formData.date}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="edit-deadline" className="text-right">
                      Application Deadline
                    </label>
                    <Input
                      id="edit-deadline"
                      name="deadline"
                      type="date"
                      className="col-span-3"
                      value={formData.deadline}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="edit-eligibility" className="text-right">
                      Eligibility Criteria
                    </label>
                    <Input
                      id="edit-eligibility"
                      name="eligibility"
                      className="col-span-3"
                      value={formData.eligibility}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleEditExam}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Delete Exam</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this exam? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {selectedExam && (
                    <div className="bg-red-50 border border-red-100 rounded-md p-4">
                      <p className="font-medium">{selectedExam.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Exam Date: {formatDate(selectedExam.date)}
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteExam}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Exam
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Approved Requests Tab */}
          <TabsContent value="requests" className="pt-4">
            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border mb-8 animate-slide-up">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, roll number..."
                    className="pl-9"
                    value={requestSearchQuery}
                    onChange={(e) => setRequestSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Requests</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Requests Table */}
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Student Name</TableHead>
                      <TableHead>Roll Number</TableHead>
                      <TableHead className="w-[300px]">Exam Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Approval Date</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.length > 0 ? (
                      filteredRequests.map((request) => (
                        <TableRow key={request.id} className="group">
                          <TableCell className="font-medium">{request.studentName}</TableCell>
                          <TableCell>{request.rollNumber}</TableCell>
                          <TableCell>{request.examName}</TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>{formatDate(request.approvalDate)}</TableCell>
                          {/* <TableCell className="text-right">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="opacity-70 group-hover:opacity-100"
                                    onClick={() => openStatusDialog(request)}
                                  >
                                    <AlignLeft size={14} className="mr-1" />
                                    Change Status
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Change request status</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell> */}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <ClipboardCheck className="h-10 w-10 mb-2" />
                            <h3 className="text-lg font-medium">No requests found</h3>
                            <p className="text-sm">
                              There are no exam requests matching your search criteria.
                            </p>
                            {(statusFilter !== "all" || requestSearchQuery) && (
                              <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                  setStatusFilter("all");
                                  setRequestSearchQuery("");
                                }}
                              >
                                Clear filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Status Update Dialog */}
            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
              <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                  <DialogTitle>Update Request Status</DialogTitle>
                  <DialogDescription>
                    Change the approval status for this comprehensive exam request.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  {selectedRequest && (
                    <div className="bg-gray-50 border border-gray-100 rounded-md p-4 mb-4">
                      <p className="font-medium">{selectedRequest.studentName}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedRequest.rollNumber}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedRequest.examName}
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      New Status
                    </label>
                    <Select
                      value={newStatus}
                      onValueChange={(value) => setNewStatus(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-amber-600" />
                            <span>Pending</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="approved">
                          <div className="flex items-center gap-2">
                            <CheckCircle size={16} className="text-green-600" />
                            <span>Approved</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="rejected">
                          <div className="flex items-center gap-2">
                            <XCircle size={16} className="text-red-600" />
                            <span>Rejected</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsStatusDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateStatus}
                    className={cn(
                      newStatus === "approved" && "bg-green-600 hover:bg-green-700",
                      newStatus === "rejected" && "bg-red-600 hover:bg-red-700"
                    )}
                  >
                    Update Status
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          <TabsContent value="upload" className="space-y-8">
          {!uploadSuccess ? (
            <>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-semibold mb-4">Upload Results File</h2>
              <FileUpload
                onFileSelect={handleFileSelect}
                accept=".xlsx,.xls,.csv"
                maxSize={5}
              />
              
              <div className="mt-6">
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isUploading}
                  className="w-full sm:w-auto"
                >
                  {isUploading ? "Processing..." : "Process Excel Data"}
                </Button>
              </div>
            </div>
            </>
            ):(
              <>
              <div className="mt-6">
              <Button onClick={handleViewStudents} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Comprehensive Exam Results
              </Button>
            </div>

            {isViewing && Results.length > 0 &&  (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-border animate-slide-up mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Comprehensive Exam Results</h2>
                  {/* <Button onClick={handleSubmit} className="flex items-center gap-2">
                    Upload Courses
                  </Button> */}
                </div>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Core(20)</TableHead>
                        <TableHead>Specialization(80)</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead> Status</TableHead>
                        
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Results.map((Results) => (
                        <TableRow key={Results.id}>
                          <TableCell className="font-medium">{Results.id}</TableCell>
                          <TableCell>{Results.name}</TableCell>
                          <TableCell>{Results.core}</TableCell>
                          <TableCell>{Results.specialization}</TableCell>
                          <TableCell>{Results.specialization+Results.core}</TableCell>
                          <TableCell>{Results.specialization + Results.core >= 35 ? "Pass" : "Fail"}</TableCell>

                          
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            </>
            )
          }
          </TabsContent>
          
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ExamAnnouncement;
