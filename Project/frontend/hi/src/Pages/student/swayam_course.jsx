import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, PlusCircle } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Student/layout/Layout';
import CourseSearch from '@/components/Student/courses/CourseSearch';
import CourseCard from '@/components/Student/courses/CourseCard';
import CourseDetailsDialog from '@/components/Student/courses/CourseDetailsDialog';
import CourseStatusDropdown from '@/components/Student/courses/CourseStatusDropdown';
import {filterCoursesByStatus, updateCourseStatus } from '@/types/courses';

const MOCK_COURSES = [
  {
    id: 'CS101',
    name: 'Introduction to Computer Science',
    credits: 4,
    description: 'An introduction to the basic principles of programming and computer science.',
    status: 'Applied',
    appliedDate: '2023-05-15T10:00:00Z',
    statusHistory: [{ status: 'Applied', date: '2023-05-15T10:00:00Z' }]
  },
  {
    id: 'AI201',
    name: 'Artificial Intelligence',
    credits: 4,
    description: 'Study of intelligent agents and how to implement them.',
    status: 'Approved',
    appliedDate: '2023-04-10T14:30:00Z',
    approvedDate: '2023-04-20T09:15:00Z',
    statusHistory: [
      { status: 'Applied', date: '2023-04-10T14:30:00Z' },
      { status: 'Approved', date: '2023-04-20T09:15:00Z' }
    ]
  }
];

const Courses = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('add');
  const [activeStatusTab, setActiveStatusTab] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState(MOCK_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getFilteredCourses = () => {
    let filtered = allCourses;

    if (activeStatusTab !== 'all') {
      filtered = filterCoursesByStatus(filtered, activeStatusTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredCourses = getFilteredCourses();

  const handleAddCourse = (course) => {
    if (!selectedCourses.some(c => c.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
      toast({ title: "Course added", description: `${course.name} has been added.` });
    } else {
      toast({ title: "Course already added", description: `${course.name} is already in your list.`, variant: "destructive" });
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses(selectedCourses.filter(course => course.id !== courseId));
    toast({ title: "Course removed", description: "Course has been removed." });
  };

  const handleSubmitCourses = () => {
    if (selectedCourses.length === 0) {
      toast({ title: "No courses selected", description: "Select at least one course.", variant: "destructive" });
      return;
    }

    const now = new Date().toISOString();
    const newCourses = selectedCourses.map(course => ({
      ...course,
      status: 'Applied',
      appliedDate: now,
      statusHistory: [{ status: 'Applied', date: now }]
    }));

    setAllCourses([...allCourses, ...newCourses]);
    setSelectedCourses([]);
    setActiveTab('view');
    toast({ title: "Courses submitted", description: `${newCourses.length} course(s) submitted.` });
  };

  const handleViewDetails = (course) => {
    const courseWithHistory = allCourses.find(c => c.id === course.id);
    if (courseWithHistory) {
      setSelectedCourse(courseWithHistory);
      setIsDetailsOpen(true);
    }
  };

  const handleStatusChange = (courseId, newStatus) => {
    setAllCourses(updateCourseStatus(allCourses, courseId, newStatus));
    toast({ title: "Status updated", description: `Course status changed to ${newStatus}.` });
  };

  const downloadCourseLog = () => {
    toast({ title: "Download started", description: "Your course log is being downloaded." });
  };


  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Swayam Courses</h1>
            {/* <p className="text-muted-foreground">Search, request, and track your academic courses</p> */}
          </div>
          <div className="flex gap-2">
            <Button 
              variant={activeTab === 'add' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('add')}
            >
              Add Courses
            </Button>
            <Button 
              variant={activeTab === 'view' ? 'default' : 'outline'} 
              onClick={() => setActiveTab('view')}
            >
              View Courses
            </Button>
          </div>
        </div>
        
        {activeTab === 'add' ? (
          <Card>
            <CardHeader>
              <CardTitle>Add Courses</CardTitle>
              <CardDescription>
                Search for courses and add them to your request list.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <CourseSearch onAddCourse={handleAddCourse} />
              
              {selectedCourses.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Selected Courses ({selectedCourses.length})</h3>
                  <div className="grid gap-3">
                    {selectedCourses.map(course => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        onRemove={handleRemoveCourse}
                      />
                    ))}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleSubmitCourses}
                  >
                    Submit Course Requests
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10 border rounded-md border-dashed">
                  <p className="text-muted-foreground">No courses selected yet. Use the search bar above to find courses.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>View Requested Courses</CardTitle>
                  <CardDescription>
                    Track the status of your course requests.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-[30%] transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={downloadCourseLog}
                    title="Download course log"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setActiveTab('add')}
                    className="hidden sm:flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Add New
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeStatusTab} onValueChange={setActiveStatusTab} className="w-full mb-6">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Applied">Requested</TabsTrigger>
                  <TabsTrigger value="Approved">Approved</TabsTrigger>
                  <TabsTrigger value="Rejected">Rejected</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {filteredCourses.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Course ID</TableHead>
                        <TableHead>Course Name</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCourses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.id}</TableCell>
                          <TableCell>{course.name}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                          <TableCell>{new Date(course.appliedDate || '').toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                course.status === 'Applied' ? 'secondary' :
                                course.status === 'Approved' ? 'success' : 'destructive'
                              }
                            >
                              {course.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(course)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10 border rounded-md border-dashed">
                  <p className="text-muted-foreground">
                    {searchTerm ? 'No courses match your search.' : activeStatusTab !== 'all' ? `No ${activeStatusTab.toLowerCase()} courses found.` : 'No courses requested yet.'}
                  </p>
                  {searchTerm === '' && activeStatusTab === 'all' && (
                    <Button
                      variant="link"
                      onClick={() => setActiveTab('add')}
                      className="mt-2"
                    >
                      Add your first course
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        <CourseDetailsDialog 
          isOpen={isDetailsOpen} 
          onClose={() => setIsDetailsOpen(false)} 
          course={selectedCourse}
        />
      </div>
    </Layout>
  );
};

export default Courses;
