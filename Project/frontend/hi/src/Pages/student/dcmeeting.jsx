import React,{ useState } from 'react';
import Layout from '@/components/Student/layout/Layout';
import { 
  Card,
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Download, Search, X, Plus, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

const MeetingStatusTabs = ['draft', 'submitted', 'approved', 'rejected', 'resubmit'];

const DCMeetings = () => {
  const [activeTab, setActiveTab] = useState('draft');
  const [meetings, setMeetings] = useState([
    {
      id: '1',
      date: '2025-01-15',
      time: '10:30 AM',
      fileName: 'DC_Report_May2023.pdf',
      notes: 'First semester progress report',
      status: 'draft'
    },
    {
      id: '2',
      date: '2025-02-20',
      time: '02:00 PM',
      fileName: 'DC_Report_Aug2023.pdf',
      notes: 'Literature review presentation',
      status: 'submitted'
    },
    {
      id: '3',
      date: '2025-02-10',
      time: '11:00 AM',
      fileName: 'DC_Report_Nov2023.pdf',
      notes: 'Methodology discussion',
      status: 'approved'
    },
    {
      id: '4',
      date: '2025-02-05',
      time: '09:30 AM',
      fileName: 'DC_Report_Feb2024.pdf',
      notes: 'Initial results presentation',
      status: 'rejected',
      comments: 'Please include more details about the experimental setup and provide comparative analysis with existing methods.'
    },
    {
      id: '5',
      date: '2025-02-18',
      time: '03:15 PM',
      fileName: 'DC_Report_Apr2024.pdf',
      notes: 'Revised results with comparisons',
      status: 'resubmit',
      comments: 'The revisions look promising, but please add statistical significance tests to validate your findings.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [newMeeting, setNewMeeting] = useState({ date: '', time: '', notes: '', fileName: '' });
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isResubmitOpen, setIsResubmitOpen] = useState(false);

  const filteredMeetings = meetings
    .filter(meeting => meeting.status === activeTab)
    .filter(meeting => searchQuery === '' || meeting.date.includes(searchQuery));

  const handleSubmit = (id) => {
    if (id) {
      setMeetings(prevMeetings => 
        prevMeetings.map(meeting => 
          meeting.id === id ? { ...meeting, status: 'submitted' } : meeting
        )
      );
      toast.success('Meeting updated and submitted successfully');
    } else {
      const newId = (meetings.length + 1).toString();
      const newMeetingWithId = { ...newMeeting, id: newId, status: 'draft' };
      setMeetings(prevMeetings => [...prevMeetings, newMeetingWithId]);
      setNewMeeting({ date: '', time: '', notes: '', fileName: '' });
      setIsNewMeetingOpen(false);
      toast.success('New meeting created successfully');
    }
  };

  const handleResubmit = (id) => {
    setMeetings(prevMeetings => 
      prevMeetings.map(meeting => 
        meeting.id === id ? { ...meeting, status: 'submitted' } : meeting
      )
    );
    setIsResubmitOpen(false);
    toast.success('Meeting resubmitted successfully');
  };

  const handleEdit = (meeting) => {
    setSelectedMeeting(meeting);
    if (meeting.status === 'resubmit') {
      setIsResubmitOpen(true);
    }
  };

  const getStatusBadge = (status) => {
    const badgeStyles = {
      draft: 'bg-slate-100 text-slate-700',
      submitted: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      resubmit: 'bg-amber-100 text-amber-700'
    };
    return <Badge variant="outline" className={badgeStyles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  };
  
  return (
    <Layout>
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">DC Meetings</h1>
          <p className="text-muted-foreground">Manage your DC meetings and submissions</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by date"
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="absolute right-2 top-2.5"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          <Dialog open={isNewMeetingOpen} onOpenChange={setIsNewMeetingOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#6A5AE0] hover:bg-[#A89FE7] transition-colors">
                <Plus className="mr-2 h-4 w-4" /> New Meeting
              </Button>
            </DialogTrigger>
            
            <DialogContent  className="sm:max-w-[500px] backdrop-blur-sm bg-white/90 border border-white/40 absolute top-[45%] left-[55%] transform -translate-x-1/2 -translate-y-1/2">
              <DialogHeader>
                <DialogTitle>Schedule New DC Meeting</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="meeting-date" className="text-sm font-medium text-gray-700"> Date</label>
                        <div className="relative">
                             <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                             <Input id="meeting-date" type="date"
                             className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#6A5AE0] focus:border-[#6A5AE0]"
                              value={newMeeting.date}
                               onChange={(e) => setNewMeeting({...newMeeting, date: e.target.value})}
                               />
            </div>
        </div>

    {/* Time Picker */}
    <div className="space-y-1">
      <label htmlFor="meeting-time" className="text-sm font-medium text-gray-700">
        Time
      </label>
      <div className="relative">
        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="meeting-time"
          type="time"
          className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#6A5AE0] focus:border-[#6A5AE0]"
          value={newMeeting.time}
          onChange={(e) => setNewMeeting({...newMeeting, time: e.target.value})}
        />
      </div>
    </div>
  </div>

  {/* DC Writeup */}
  <div className="space-y-1">
    <label htmlFor="meeting-notes" className="text-sm font-medium text-gray-700">
      DC Writeup
    </label>
    <Textarea
      id="meeting-notes"
      placeholder="Enter details about the meeting agenda and progress..."
      className="w-full min-h-[120px] py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#6A5AE0] focus:border-[#6A5AE0]"
      value={newMeeting.notes}
      onChange={(e) => setNewMeeting({...newMeeting, notes: e.target.value})}
    />
  </div>

  {/* File Upload */}
  <div className="space-y-1">
    <label htmlFor="file-upload" className="text-sm font-medium text-gray-700">
      File Upload
    </label>
    
    <Input
      id="file-upload"
      type="file"
      accept=".pdf,.doc,.docx"
      className="w-full py-2 px-3 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-[#6A5AE0] focus:border-[#6A5AE0]"
      onChange={(e) => {
        if (e.target.files && e.target.files[0]) {
          setNewMeeting({...newMeeting, fileName: e.target.files[0].name});
        }
      }}
    />
    {newMeeting.fileName && (
      <p className="text-sm text-gray-600 flex items-center mt-2">
        <FileText className="h-4 w-4 mr-1 text-gray-500" /> {newMeeting.fileName}
      </p>
    )}
  </div>
</div>

              <div className="flex justify-between mt-4">
                <Button variant="outline" onClick={() => setIsNewMeetingOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-[#6A5AE0] hover:bg-[#A89FE7] transition-colors"
                  onClick={() => handleSubmit()}
                >
                  Create Meeting
                </Button>
              </div>
            </DialogContent>
           
          </Dialog>
        </div>
      </div>
        
        <Card className="shadow-md border-gray-200">
          <CardHeader className="pb-2">
            <CardTitle>Meeting Records</CardTitle>
            <CardDescription>
              Filter and manage your DC meeting records by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="draft" 
              className="w-full"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value)}
            >
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="draft" className="data-[state=active]:bg-[#A89FE7]/20 data-[state=active]:border-b-2 data-[state=active]:border-[#6A5AE0]">
                  Draft
                </TabsTrigger>
                <TabsTrigger value="submitted" className="data-[state=active]:bg-[#A89FE7]/20 data-[state=active]:border-b-2 data-[state=active]:border-[#6A5AE0]">
                  Submitted
                </TabsTrigger>
                <TabsTrigger value="approved" className="data-[state=active]:bg-[#A89FE7]/20 data-[state=active]:border-b-2 data-[state=active]:border-[#6A5AE0]">
                  Approved
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-[#A89FE7]/20 data-[state=active]:border-b-2 data-[state=active]:border-[#6A5AE0]">
                  Rejected
                </TabsTrigger>
                {/* <TabsTrigger value="resubmit" className="data-[state=active]:bg-[#A89FE7]/20 data-[state=active]:border-b-2 data-[state=active]:border-[#6A5AE0]">
                  Resubmit
                </TabsTrigger> */}
              </TabsList>
              
              {['draft', 'submitted', 'approved', 'rejected', 'resubmit'].map((tab) => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">File Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Notes</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMeetings.length > 0 ? (
                          filteredMeetings.map((meeting) => (
                            <tr 
                              key={meeting.id} 
                              className="border-b border-gray-200 hover:bg-[#A89FE7]/5 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm">{meeting.date}</td>
                              <td className="px-4 py-3 text-sm">{meeting.time}</td>
                              <td className="px-4 py-3 text-sm ">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-[#3B82F6]" />
                                <span>{meeting.fileName}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">{meeting.notes}</td>
                              <td className="px-4 py-3 text-sm">
                                {getStatusBadge(meeting.status)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {meeting.status === 'draft' && (
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleEdit(meeting)}
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      size="sm"
                                      className="bg-[#6A5AE0] hover:bg-[#A89FE7]"
                                      onClick={() => handleSubmit(meeting.id)}
                                    >
                                      Submit
                                    </Button>
                                  </div>
                                )}
                                
                                {meeting.status === 'submitted' && (
                                  <Button variant="outline" size="sm" disabled>
                                    Pending Review
                                  </Button>
                                )}
                                
                                {meeting.status === 'approved' && (
                                  <Button variant="outline" size="sm">
                                    <Download className="h-4 w-4 mr-1" />
                                    Download
                                  </Button>
                                )}
                                
                                {meeting.status === 'rejected' && (
                                  <div className="flex flex-col gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleEdit(meeting)}
                                    >
                                      <MessageSquare className="h-4 w-4 mr-1" />
                                      View Comments
                                    </Button>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button 
                                          size="sm"
                                          className="bg-[#6A5AE0] hover:bg-[#A89FE7]"
                                        >
                                          Resubmit
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-[500px] backdrop-blur-sm bg-white/90 border border-white/40 absolute top-[45%] left-[55%] transform -translate-x-1/2 -translate-y-1/2">
                                        <DialogHeader>
                                          <DialogTitle>Resubmit Meeting</DialogTitle>
                                        </DialogHeader>
                                        
                                        <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                                          <p className="text-sm font-medium text-red-800 mb-1">Guide's Comments:</p>
                                          <p className="text-sm text-red-600">{meeting.comments}</p>
                                        </div>
                                        
                                        <div className="space-y-4 py-4">
                                          <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                              <label className="text-sm font-medium">Date</label>
                                              <Input type="date" defaultValue={meeting.date} disabled />
                                            </div>
                                            <div className="space-y-2">
                                              <label className="text-sm font-medium">Time</label>
                                              <Input type="text" defaultValue={meeting.time} disabled />
                                            </div>
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <label className="text-sm font-medium">DC Writeup</label>
                                            <Textarea
                                              defaultValue={meeting.notes}
                                              className="min-h-[120px]"
                                              placeholder="Update your DC writeup based on the comments"
                                            />
                                          </div>
                                          
                                          <div className="space-y-2">
                                            <label className="text-sm font-medium">Upload Revised File</label>
                                            <Input type="file" accept=".pdf,.doc,.docx" />
                                          </div>
                                        </div>
                                        
                                        <div className="flex justify-between mt-4">
                                          <Button variant="outline">Cancel</Button>
                                          <Button 
                                            className="bg-[#6A5AE0] hover:bg-[#A89FE7]"
                                            onClick={() => handleResubmit(meeting.id)}
                                          >
                                            Resubmit
                                          </Button>
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  </div>
                                )}
                                
                                {/* {meeting.status === 'resubmit' && (
                                  <div className="flex flex-col gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                      onClick={() => handleEdit(meeting)}
                                    >
                                      <MessageSquare className="h-4 w-4 mr-1" />
                                      View Comments
                                    </Button>
                                    <Button 
                                      size="sm"
                                      className="bg-[#6A5AE0] hover:bg-[#A89FE7]"
                                      onClick={() => setIsResubmitOpen(true)}
                                    >
                                      Resubmit
                                    </Button>
                                  </div>
                                )} */}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                              No meetings found with {activeTab} status.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Resubmit Dialog */}
                  {selectedMeeting && (
                    <Dialog open={isResubmitOpen} onOpenChange={setIsResubmitOpen}>
                      <DialogContent className="sm:max-w-[500px] backdrop-blur-sm bg-white/90 border border-white/40">
                        <DialogHeader>
                          <DialogTitle>Resubmit Meeting</DialogTitle>
                        </DialogHeader>
                        
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
                          <p className="text-sm font-medium text-amber-800 mb-1">Guide's Comments:</p>
                          <p className="text-sm text-amber-600">{selectedMeeting.comments}</p>
                        </div>
                        
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Date</label>
                              <Input type="date" defaultValue={selectedMeeting.date} disabled />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Time</label>
                              <Input type="text" defaultValue={selectedMeeting.time} disabled />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">DC Writeup</label>
                            <Textarea
                              defaultValue={selectedMeeting.notes}
                              className="min-h-[120px]"
                              placeholder="Update your DC writeup based on the comments"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Upload Revised File</label>
                            <Input type="file" accept=".pdf,.doc,.docx" />
                            <p className="text-sm text-muted-foreground mt-1">
                              Current file: {selectedMeeting.fileName}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsResubmitOpen(false)}>
                            Cancel
                          </Button>
                          <Button 
                            className="bg-[#6A5AE0] hover:bg-[#A89FE7]"
                            onClick={() => handleResubmit(selectedMeeting.id)}
                          >
                            Resubmit
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DCMeetings;
