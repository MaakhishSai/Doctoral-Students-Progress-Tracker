import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  User,
  MoreHorizontal
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PageLayout from "@/components/Guide/layout/Layout";
import { useNavigate } from "react-router-dom";

const MeetingApprovals =() => {
    const navigate=useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const allRecords = [
    {
      id: 1,
      date: "2025-02-21",
      time: "02:00 PM",
      studentName: "Rahul Sharma",
      fileName: "DC_Report_Aug2023.pdf",
      writeup: "Literature review presentation covering the recent advances in machine learning and artificial intelligence. The student presented a comprehensive analysis of transformer-based models and their applications in natural language processing. Discussion included potential research directions and methodological approaches for the PhD thesis.",
      status: "submitted",
      action: "Pending Review"
    },
    {
      id: 2,
      date: "2025-02-15",
      time: "10:30 AM",
      studentName: "Priya Patel",
      fileName: "Research_Methodology.pdf",
      writeup: "Discussion on research approach and methodology selection. The meeting focused on experimental design, sampling techniques, and statistical analysis methods appropriate for the research questions. The committee provided feedback on strengthening the methodology section and suggested additional controls for the experiments.",
      status: "approved",
      action: "Approved on Feb 18"
    },
    {
      id: 3,
      date: "2025-02-10",
      time: "01:15 PM",
      studentName: "Amit Kumar",
      fileName: "Progress_Report_Jan2025.pdf",
      writeup: "Preliminary results discussion showing promising outcomes in the first phase of experiments. Data collection is approximately 65% complete with initial findings supporting the primary hypothesis. The committee suggested additional analyses and visualization techniques to better communicate the results in the final thesis.",
      status: "rejected",
      action: "Rejected on Feb 12"
    },
    {
      id: 4,
      date: "2025-02-05",
      time: "11:00 AM",
      studentName: "Sneha Gupta",
      fileName: "Data_Analysis_Report.pdf",
      writeup: "Statistical analysis of collected data using advanced multivariate techniques. The presentation included principal component analysis, cluster analysis, and regression models to identify patterns in the dataset. Discussion focused on interpretation of results and their implications for the theoretical framework proposed in the thesis.",
      status: "draft",
      action: "Save as Draft"
    },
    {
      id: 5,
      date: "2025-01-28",
      time: "03:30 PM",
      studentName: "Vikram Singh",
      fileName: "Thesis_Outline.pdf",
      writeup: "Initial thesis structure presentation with chapter outlines and key arguments. The proposed structure includes literature review, methodology, results, and discussion chapters. The committee provided feedback on organization, suggested additional sections, and recommended focusing the scope of certain chapters to maintain coherence.",
      status: "approved",
      action: "Approved on Jan 30"
    }
  ];

  const getFilteredRecords = (status) => {
    return allRecords
      .filter(record => record.status === status)
      .filter(record => 
        record.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.writeup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date.includes(searchTerm)
      );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const handleAction = (id, action) => {
    toast({
      title: `Document ${action}`,
      description: `You have ${action.toLowerCase()} the document submission.`,
      variant: action === "Approved" ? "default" : "destructive",
    });
    console.log(`Document ${id} ${action.toLowerCase()}`);
  };

  const handleDownload = (fileName) => {
    toast({
      title: "Downloading Document",
      description: `Downloading ${fileName}...`,
    });
    console.log(`Downloading ${fileName}`);
  };

  // Function to truncate text and add ellipsis
  const truncateText = (text, maxLength = 70) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <PageLayout>
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minutes Approvals</h1>
        <p className="text-muted-foreground mt-1">
          Review and approve student submitted meeting documents
        </p>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Student Submissions</CardTitle>
              <CardDescription>
                Review and manage student DC meeting Minutes
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search by name or content..."
                className="pl-8 w-full sm:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="submitted" className="w-full">
            <TabsList className="mb-6">
              {/* <TabsTrigger value="draft">Draft</TabsTrigger> */}
              <TabsTrigger value="submitted">Pending Review</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            
            {["draft", "submitted", "approved", "rejected"].map((status) => (
              <TabsContent key={status} value={status} className="animate-fade-up">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-gray-500 bg-gray-50 rounded-t-md">
                    <div className="col-span-1">Date</div>
                    <div className="col-span-1">Time</div>
                    <div className="col-span-2">Student</div>
                    <div className="col-span-2">Document</div>
                    <div className="col-span-3">Writeup</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  
                  <Separator />
                  
                  {getFilteredRecords(status).length > 0 ? (
                    getFilteredRecords(status).map((record) => (
                      <div key={record.id} className="animate-fade-in">
                        <div className="grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-gray-50 transition-colors">
                          <div className="col-span-1">{record.date}</div>
                          <div className="col-span-1">{record.time}</div>
                          <div className="col-span-2 flex items-center">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{record.studentName}</span>
                          </div>
                          <div className="col-span-2 flex items-center">
                            <FileText className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{record.fileName}</span>
                          </div>
                          <div className="col-span-3 flex items-center">
                            <span className="truncate">{truncateText(record.writeup)}</span>
                            {record.writeup.length > 70 && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="ml-1 h-6 w-6"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 max-h-60 overflow-y-auto p-4">
                                  <div className="text-sm">
                                    <p className="font-medium mb-1">Full Writeup:</p>
                                    <p className="text-gray-700">{record.writeup}</p>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                          <div className="col-span-2">
                            <div className="flex items-center">
                              {getStatusIcon(record.status)}
                              <span className={cn(
                                "ml-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                                record.status === "submitted" && "bg-blue-100 text-blue-800",
                                record.status === "approved" && "bg-green-100 text-green-800",
                                record.status === "rejected" && "bg-red-100 text-red-800",
                                record.status === "draft" && "bg-gray-100 text-gray-800"
                              )}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="col-span-1 flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Download Document"
                              onClick={() => handleDownload(record.fileName)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            
                            {status === "submitted" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-green-600" 
                                  title="Approve Submission"
                                  onClick={() => handleAction(record.id, "Approved")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-red-600" 
                                  title="Reject Submission"
                                  onClick={() => handleAction(record.id, "Rejected")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      No {status} records found
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
    <div className="absolute right-4 bottom-4">
          <Button variant="outline" onClick={() => navigate('/meetings_g')}>
            ← Back
          </Button>
        </div>
    </PageLayout>
  );
};

export default MeetingApprovals;
