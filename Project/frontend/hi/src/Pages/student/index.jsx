import React, { useEffect, useState } from 'react';
import Layout from '@/components/Student/layout/Layout';
import ProfileCard from '@/components/Student/Dashboard/ProfileCard';
import StatsCard from '@/components/Student/Dashboard/StatsCard';
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  BookOpen, 
  FileCheck, 
  GraduationCap, 
  ChevronRight, 
  PlusCircle, 
  Clock 
} from 'lucide-react';
import axios from 'axios';

// Mock data - Unchanged fields
const mockProfileData = {
  rollNumber: "P220780CS",
  orcid: "0000-0001-2345-6789",
  avatarUrl: "/placeholder.svg"
};

const upcomingMeetings = [
  {
    id: 1,
    title: "DC Committee Meeting",
    date: "Nov 15, 2024",
    status: "scheduled",
  },
  {
    id: 2,
    title: "Progress Review",
    date: "Dec 05, 2024",
    status: "pending",
  }
];

const recentPublications = [
  {
    id: 1,
    title: "Deep Learning Approaches for Natural Language Processing in Healthcare",
    journal: "IEEE Transactions on Medical Imaging",
    status: "published",
    date: "jan 1, 2024",
  },
  {
    id: 2,
    title: "Novel Approaches to Quantum Computing Algorithms",
    journal: "Physical Review Letters",
    status: "Editorial Revision",
    date: "june 15, 2024",
  }
];

const Index = () => {
  const [profileData, setProfileData] = useState(mockProfileData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/user/profile', {
          withCredentials: true
        });

        // Check if response has data
        if (response.data && response.data.name && response.data.email) {
          setProfileData(prevData => ({
            ...prevData,
            name: response.data.name,
            email: response.data.email
          }));
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileCard profileData={profileData} />
          </div>
          
          <div className="space-y-6">
            <StatsCard
              title="Publications"
              value={5}
              description="2 pending, 3 published"
              icon={<BookOpen className="h-6 w-6" />}
            />
            <StatsCard
              title="DC Meetings"
              description="Next meeting on Nov 15"
              icon={<Calendar className="h-6 w-6" />}
            
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-transition">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Meetings</CardTitle>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>New Meeting</span>
                  </Button>
                </div>
                <CardDescription>Your scheduled DC meetings and progress reviews</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingMeetings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="flex items-center p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{meeting.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {meeting.date}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {meeting.time}
                            </p>
                          </div>
                        </div>
                        <div className={`text-xs font-medium px-2 py-0.5 rounded ${
                          meeting.status === 'scheduled' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {meeting.status === 'scheduled' ? 'Scheduled' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <Calendar className="mx-auto h-8 w-8 opacity-40 mb-2" />
                    <p>No upcoming meetings scheduled</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-1">
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>View all meetings</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="card-transition">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Publications</CardTitle>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Add Publication</span>
                  </Button>
                </div>
                <CardDescription>Your recent papers and journal submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPublications.length > 0 ? (
                  <div className="space-y-4">
                    {recentPublications.map((publication) => (
                      <div key={publication.id} className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-sm line-clamp-1">{publication.title}</h4>
                          <div className={`text-xs font-medium ml-2 px-2 py-0.5 rounded flex-shrink-0 ${
                            publication.status === 'published' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}>
                            {publication.status === 'published' ? 'Published' : 'Under Review'}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{publication.journal}</p>
                        <p className="text-xs text-muted-foreground mt-1">{publication.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <BookOpen className="mx-auto h-8 w-8 opacity-40 mb-2" />
                    <p>No publications yet</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-1">
                <Button variant="ghost" size="sm" className="w-full justify-between" onClick ={()=>navigate("/publication")}>
                  <span>View all publications</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="space-y-6">       

            
            <Card className="card-transition">
              <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2" onClick={() => navigate('/dcmeeting')}>
                  <PlusCircle className="h-4 w-4" />
                  <span> DC Meeting</span>
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2" onClick={()=> navigate('/addpublication')}>
                  <PlusCircle className="h-4 w-4" />
                  <span>Add New Publication</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
