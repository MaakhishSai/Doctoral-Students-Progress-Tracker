import { useState, useEffect } from 'react';
import { Search, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestStatus from '@/components/Guide/courses/RequestStatus';
import ActionDialog from '@/components/Guide/courses/ActionDialog';
import PageLayout from "@/components/Guide/layout/Layout";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Actions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const [guideEmail, setGuideEmail] = useState("");
  const [guideId, setGuideId] = useState(null);
  const [students, setStudents] = useState([]);
  const [courseRequests, setCourseRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch Guide Email
  useEffect(() => {
    const fetchGuideEmail = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/super", { withCredentials: true });
        if (response.data.email) {
          setGuideEmail(response.data.email);
        } else {
          console.error("Failed to fetch guide email");
        }
      } catch (error) {
        console.error("Error fetching guide email:", error);
      }
    };
    fetchGuideEmail();
  }, []);

  // Fetch Guide ID
  useEffect(() => {
    if (!guideEmail) return;
    const fetchGuideId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/email/${guideEmail}`, { withCredentials: true });
        if (response.data) {
          setGuideId(response.data);
        } else {
          console.error("Guide ID not found");
        }
      } catch (error) {
        console.error("Error fetching guide ID:", error);
      }
    };
    fetchGuideId();
  }, [guideEmail]);

  // Fetch Students Under Guide
  useEffect(() => {
    if (!guideId) return;
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/${guideId}/students`, { withCredentials: true });
        if (response.data) {
          setStudents(response.data);
        } else {
          console.error("No students found for this guide");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchStudents();
  }, [guideId]);

  // Fetch Course Requests for Students
  useEffect(() => {
    if (students.length === 0) return;
    const fetchCourseRequests = async () => {
      try {
        const requests = await Promise.all(
          students.map(async (student) => {
            const response = await axios.get(`http://localhost:8080/api/coursereq/status/${student.rollNo}`, {
              withCredentials: true,
            });
            return response.data;
          })
        );
        const allRequests = requests.flat();
        setCourseRequests(allRequests);
        setFilteredRequests(allRequests);
      } catch (error) {
        console.error("Error fetching course requests:", error);
      }
    };
    fetchCourseRequests();
  }, [students]);

  // Filter Requests Based on Search & Active Tab
  useEffect(() => {
    const enrichedRequests = courseRequests.map((request) => {
      const student = students.find((s) => s.rollNo === request.studentId);
      return {
        ...request,
        studentName: student ? student.name : "Unknown",
      };
    });

    const filtered = enrichedRequests.filter((request) => {
      const matchesSearch =
        request.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.studentName.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === "all") return matchesSearch;
      return matchesSearch && request.status.toLowerCase() === activeTab.toLowerCase();
    });

    setFilteredRequests(filtered);
  }, [searchQuery, activeTab, courseRequests, students]);

  // Handle Viewing Course Details
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  return (
    <PageLayout>
      <div className="flex h-screen">
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto animate-fade-in">
            <div className="page-container">
              <div className="max-w-full mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Course Requests</h2>
                </div>

                {/* Course Requests Panel */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                  <div className="flex justify-between items-center">
                    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                      <TabsList className="bg-gray-100 p-1 rounded-full">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="approved">Approved</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                      </TabsList>
                    </Tabs>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-[30%] transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        type="text"
                        placeholder="Search courses..." 
                        className="pl-10 w-[250px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Course Requests Table */}
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Course ID", "Course Name", "Student", "Duration", "Status", "Actions"].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">{request.courseId}</td>
                          <td className="px-6 py-4">{request.courseName}</td>
                          <td className="px-6 py-4">{request.studentName}</td>
                          <td className="px-6 py-4">{request.duration}</td>
                          <td className="px-6 py-4"><RequestStatus status={request.status} /></td>
                          <td className="px-6 py-4">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(request)}>
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Course Details Dialog */}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        
        <DialogContent className="max-w-lg p-6">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{selectedRequest.courseName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm text-gray-700">
                <p><strong>Course ID:</strong> {selectedRequest.courseId}</p>
                <p><strong>Duration:</strong> {selectedRequest.duration}</p>
                <p><strong>Start Date:</strong> {selectedRequest.startDate}</p>
                <p><strong>End Date:</strong> {selectedRequest.endDate}</p>
                <p><strong>Provider:</strong> {selectedRequest.provider}</p>
                {/* <p><strong>Institute:</strong> {selectedCourse.institute || "N/A"}</p> */}
                {/* <p><strong>Co-Institute:</strong> {selectedCourse.co_Institute || "N/A"}</p> */}
              </div>
              <DialogFooter>
                <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Actions;
