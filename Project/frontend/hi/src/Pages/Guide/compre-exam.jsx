import { useState } from 'react';
import { Search, Plus, Download, Check, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestStatus from '@/components/Guide/courses/RequestStatus';
import ActionDialogg from '@/components/Guide/courses/ActionDialogg';
import PageLayout from "@/components/Guide/layout/Layout";
import { useNavigate } from "react-router-dom";

// Mock data for requests
const mockRequests = [
  { 
    id: '1', 
    courseId: 'P220780CS', 
    courseName: 'Comprehensive exam', 
    credits: 4, 
    appliedDate: '5/15/2023', 
    status: 'Applied', 
    studentName: 'John Doe',
    //studentId: 'PHD2023001'
  },
  { 
    id: '2', 
    courseId: 'P230780CS', 
    courseName: 'Comprehensive exam', 
    credits: 4, 
    appliedDate: '4/10/2023', 
    status: 'Approved', 
    studentName: 'Jane Smith',
    //studentId: 'PHD2022045'
  },
  { 
    id: '3', 
    courseId: 'P240780CS', 
    courseName: 'Comprehensive exam', 
    credits: 3, 
    appliedDate: '5/20/2023', 
    status: 'Pending', 
    studentName: 'Mike Johnson',
    //studentId: 'PHD2023010'
  },
  { 
    id: '4', 
    courseId: 'P210545CS', 
    courseName: 'Comprehensive exam', 
    credits: 3, 
    appliedDate: '4/25/2023', 
    status: 'Pending', 
    studentName: 'Sarah Williams',
    //studentId: 'PHD2022078'
  },
  { 
    id: '5', 
    courseId: 'P220545CS', 
    courseName: 'Comprehensive exam', 
    credits: 4, 
    appliedDate: '5/05/2023', 
    status: 'Rejected', 
    studentName: 'David Brown',
    //studentId: 'PHD2023015'
  },
];

const Compre = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter requests based on search query and active tab
  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = 
      request.courseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'applied') return matchesSearch && request.status === 'Applied';
    if (activeTab === 'approved') return matchesSearch && request.status === 'Approved';
    if (activeTab === 'rejected') return matchesSearch && request.status === 'Rejected';
    if (activeTab === 'pending') return matchesSearch && request.status === 'Pending';
    
    return matchesSearch;
  });

  const handleAction = (request,type) => {
    setSelectedRequest(request);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    // Here we would typically make an API call to update the status
    // For now, just show a toast notification
    const action = actionType === 'approve' ? 'approved' : 'rejected';
    
    toast({
      title: `Request ${action}`,
      description: `You have ${action} ${selectedRequest.courseName} for ${selectedRequest.studentName}`,
    });
    
    setDialogOpen(false);
  };

  return (
    <PageLayout>
    <div className="flex h-screen">
     
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-y-auto animate-fade-in">
          <div className="page-container">
            <div className="max-w-full mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Exam Requests</h2>
                <div className="flex gap-2">
                  {/* <Button variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
                    <Plus className="h-4 w-4" />
                    Add New
                  </Button> */}
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">View exam requests</h3>
                    <p className="text-sm text-gray-500">Track the status of exam requests.</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                      <TabsList className="bg-gray-100 p-1 rounded-full">
                        <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
                        <TabsTrigger value="pending" className="rounded-full">Pending</TabsTrigger>
                        <TabsTrigger value="approved" className="rounded-full">Approved</TabsTrigger>
                        <TabsTrigger value="rejected" className="rounded-full">Rejected</TabsTrigger>
                        
                      </TabsList>
                    </Tabs>
                    
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          type="text"
                          placeholder="Search courses..." 
                          className="pl-10 w-[250px]"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Roll No
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Exam Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Credits
                          </th> */}
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applied Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequests.length > 0 ? (
                          filteredRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {request.courseId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {request.courseName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex flex-col">
                                  <span className="text-gray-900">{request.studentName}</span>
                                  <span className="text-gray-500 text-xs">{request.studentId}</span>
                                </div>
                              </td>
                              {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.credits}
                              </td> */}
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.appliedDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <RequestStatus status={request.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.status === 'Pending' && (
                                  <div className="flex space-x-2">
                                    <Button 
                                      onClick={() => handleAction(request, 'approve')}
                                      variant="outline" 
                                      size="sm" 
                                      className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                    >
                                      <Check className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button 
                                      onClick={() => handleAction(request, 'reject')}
                                      variant="outline" 
                                      size="sm" 
                                      className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                                {(request.status === 'Approved' || request.status === 'Rejected' || request.status === 'Applied') && (
                                  <Button variant="outline" size="sm">
                                    Details
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                              No requests found matching your criteria.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <ActionDialogg
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        actionType={actionType}
        request={selectedRequest}
        onConfirm={handleConfirmAction}
      />
    </div>
    </PageLayout>
  );
};

export default Compre;
