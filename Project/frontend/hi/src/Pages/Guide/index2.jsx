import React, { useEffect, useState } from "react";
import axios from "axios";
import PageLayout from "@/components/Guide/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, Clock, FilePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboardg = () => {
  const [guideEmail, setGuideEmail] = useState("");
  const [guideId, setGuideId] = useState(null);
  const [scholars, setScholars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuideEmail = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/super", { withCredentials: true });
        setGuideEmail(response.data.email || "");
      } catch (error) {
        console.error("Error fetching guide email:", error);
      }
    };
    fetchGuideEmail();
  }, []);

  useEffect(() => {
    if (!guideEmail) return;
    const fetchGuideId = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/email/${guideEmail}`, { withCredentials: true });
        setGuideId(response.data || null);
      } catch (error) {
        console.error("Error fetching guide ID:", error);
      }
    };
    fetchGuideId();
  }, [guideEmail]);

  useEffect(() => {
    if (!guideId) return;
    const fetchScholars = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/guides/${guideId}/students`, { withCredentials: true });
        setScholars(response.data || []);
      } catch (error) {
        console.error("Error fetching scholars:", error);
        setError("Failed to load scholars");
      } finally {
        setLoading(false);
      }
    };
    fetchScholars();
  }, [guideId]);

  const upcomingDCMeetings = [
    { id: 1, title: "DC Meeting - Rahul Kumar", date: "March 12, 2025", time: "10:00 AM" },
    { id: 2, title: "DC Meeting - Priya Singh", date: "March 10, 2025", time: "2:00 PM" },
    { id: 3, title: "DC Meeting - Amit Patel", date: "March 15, 2025", time: "11:30 AM" },
  ];

  const pendingRequests = [
    { id: 1, type: "Course Request", title: "Advanced Machine Learning", scholar: "Rahul Kumar", date: "Feb 28, 2025", status: "Pending" },
    { id: 2, type: "Publication Submission", title: "Neural Networks for Medical Imaging", scholar: "Priya Singh", date: "Feb 27, 2025", status: "Pending" },
    { id: 3, type: "Course Request", title: "Deep Learning Fundamentals", scholar: "Amit Patel", date: "Feb 16, 2025", status: "Pending" },
  ];

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-soft animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Scholars</p>
                  <h3 className="text-2xl font-semibold">{loading ? "Loading..." : scholars.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Upcoming DC Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDCMeetings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDCMeetings.map((meeting) => (
                    <div key={meeting.id} className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-all-200">
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
          
          <Card className="shadow-soft animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="flex gap-4 p-3 rounded-lg border bg-card hover:bg-accent/5 transition-all-200">
                      <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full h-fit">
                        <FilePlus className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{request.title}</h3>
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">{request.status}</Badge>
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