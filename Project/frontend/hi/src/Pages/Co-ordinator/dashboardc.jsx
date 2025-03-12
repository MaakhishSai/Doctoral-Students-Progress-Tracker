import React from "react";
import PageLayout from "@/components/Co-ordinator/layout/Layout";
import { Card, CardContent,CardDescription,CardHeader, CardTitle,CardFooter } from "@/components/ui/card";

// import { UserCheck, Calendar, BookOpen, FileText, Clock, FilePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { UploadCloud, BookOpen, ClipboardCheck,ChevronRight} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Dashboardc= () => {
  // Sample data for DC meetings only
  const navigate= useNavigate();
  const upcomingDCMeetings = [
    { id: 1, title: "DC Meeting - Rahul Kumar", date: "March 12, 2025", time: "10:00 AM" },
    { id: 2, title: "DC Meeting - Priya Singh", date: "March 10, 2025", time: "2:00 PM" },
    { id: 3, title: "DC Meeting - Amit Patel", date: "March 15, 2025", time: "11:30 AM" },
  ];

  // Sample data for pending requests
  const pendingRequests = [
    { 
      id: 1, 
      type: "Course Request", 
      title: "Advanced Machine Learning", 
      scholar: "Rahul Kumar",
      date: "feb 28, 2025",
      status: "Pending"
    },
    { 
      id: 2, 
      type: "Publication Submission", 
      title: "Neural Networks for Medical Imaging", 
      scholar: "Priya Singh",
      date: "feb 27, 2025",
      status: "Pending"
    },
    { 
      id: 3, 
      type: "Course Request", 
      title: "Deep Learning Fundamentals", 
      scholar: "Amit Patel",
      date: "feb 16, 2025",
      status: "Pending"
    },
  ];


  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        
        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Upload Courses</CardTitle>
                <UploadCloud className="h-5 w-5 text-phd-accent" />
              </div>
              <CardDescription>
                Upload and manage your course data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
              Import your swayam course information from Excel or CSV files.
              </p>
              <CardFooter className="pt-1">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>Go to upload</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </CardContent>
          </Card>

          {/* <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Swayam Courses</CardTitle>
                <BookOpen className="h-5 w-5 text-phd-accent" />
              </div>
              <CardDescription>
                Browse available Swayam courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Explore online courses available through the Swayam platform.
              </p>
              <CardFooter className="pt-1">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>Browse Courses</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </CardContent>
          </Card> */}

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Exam Requests</CardTitle>
                <ClipboardCheck className="h-5 w-5 text-phd-accent" />
              </div>
              <CardDescription>
                Manage comprehensive exam requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Submit and track your comprehensive examination requests.
              </p>
              <CardFooter className="pt-1">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>View all meetings</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
          </div>
      </div>
    </PageLayout>
  );
};

export default Dashboardc;
