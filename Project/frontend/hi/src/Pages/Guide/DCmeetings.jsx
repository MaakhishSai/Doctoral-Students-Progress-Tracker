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
import { CalendarIcon, Clock, Plus, Search } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import PageLayout from "@/components/Guide/layout/Layout";
import { useNavigate } from "react-router-dom";

const DCMeetingsg = () => {
    const navigate=useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(undefined);
  
  const upcomingMeetings = [
    {
      id: 1,
      scholar: "Rahul Kumar",
      date: "March 12, 2025",
      time: "10:00 AM",
      type: "DC Meeting",
      agenda: "Progress Review"
    },
    {
      id: 2,
      scholar: "Priya Singh",
      date: "March 10, 2025",
      time: "2:00 PM",
      type: "DC Meeting",
      agenda: "Thesis Proposal"
    },
    {
      id: 3,
      scholar: "Amit Patel",
      date: "March 15, 2025",
      time: "11:30 AM",
      type: "DC Meeting",
      agenda: "Research Methodology Discussion"
    },
    {
      id: 4,
      scholar: "Neha Gupta",
      date: "March 18, 2025",
      time: "3:30 PM",
      type: "DC Meeting",
      agenda: "Literature Review"
    },
    {
      id: 5,
      scholar: "Vikram Sharma",
      date: "March 20, 2025",
      time: "9:00 AM",
      type: "DC Meeting",
      agenda: "Experiment Results Analysis"
    }
  ];

  const filteredMeetings = upcomingMeetings.filter(meeting => {
    const matchesSearch = 
      meeting.scholar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.agenda.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !date || meeting.date.includes(format(date, "MMMM d, yyyy"));
    
    return matchesSearch && matchesDate;
  });

  return (
    <PageLayout>
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DC Meetings</h1>
          <p className="text-muted-foreground mt-1">
            Manage doctoral committee meetings with PhD scholars
          </p>
        </div>
        <Button className="bg-sidebar-primary text-white hover:bg-blue-600"  onClick={()=>navigate('/meetingsapprovals')}>
         Minutes Approvals
        </Button>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Upcoming Meetings</CardTitle>
              <CardDescription>
                View and manage scheduled DC meetings
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search meetings..."
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Filter by date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              
              {date && (
                <Button 
                  variant="ghost" 
                  onClick={() => setDate(undefined)}
                  className="px-2"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map(meeting => (
                <div 
                  key={meeting.id}
                  className="p-4 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 animate-scale-in"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 p-3 rounded-full">
                        <Clock className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{meeting.type} - {meeting.scholar}</h3>
                        <p className="text-sm text-gray-500">{meeting.agenda}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-center">
                      <div className="text-right">
                        <p className="font-medium">{meeting.date}</p>
                        <p className="text-sm text-gray-500">{meeting.time}</p>
                      </div>
                      <Button variant="outline" size="sm">Details</Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No meetings found matching your filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </PageLayout>
  );
};

export default DCMeetingsg;
