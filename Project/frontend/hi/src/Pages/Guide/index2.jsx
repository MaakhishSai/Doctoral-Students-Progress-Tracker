import React from "react";
import PageLayout from "@/components/Guide/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Calendar, BookOpen, FileText, Clock, FilePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboardg= () => {
  // Sample data for DC meetings only
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-soft animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Scholars</p>
                  <h3 className="text-2xl font-semibold">8</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* <Card className="shadow-soft animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DC Meetings</p>
                  <h3 className="text-2xl font-semibold">12</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Publications</p>
                  <h3 className="text-2xl font-semibold">24</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-soft animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
                  <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SWAYAM Courses</p>
                  <h3 className="text-2xl font-semibold">16</h3>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
        
        {/* Main content area - Meetings and Requests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming DC Meetings */}
          <Card className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming DC Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDCMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDCMeetings.map((meeting) => (
                    <div 
                      key={meeting.id} 
                      className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-all-200"
                    >
                      <div className="bg-primary/10 p-2 rounded-full h-fit">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{meeting.title}</h3>
                        <div className="flex justify-between mt-1">
                          <p className="text-sm text-muted-foreground">{meeting.date}</p>
                          <p className="text-sm font-medium">{meeting.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-muted-foreground">No upcoming DC meetings scheduled.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Pending Requests */}
          <Card className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-all-200"
                    >
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full h-fit">
                        <FilePlus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{request.title}</h3>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            {request.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">{request.type}</span> from {request.scholar}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Submitted on {request.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <p className="text-muted-foreground">No pending requests.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboardg;
