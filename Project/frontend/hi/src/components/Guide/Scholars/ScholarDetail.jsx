
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  User, GraduationCap, 
  BookOpen, FileText, 
  Calendar, Clipboard, 
  ClipboardCheck, Users
} from "lucide-react";



const ScholarDetail= ({ scholar }) => {
  // In a real app, these would be fetched based on the scholar ID
  const dcMembers = [
    "Dr. Anand Kumar (Guide)",
    "Dr. Ramesh Iyer (Chair)",
    "Dr. Suman Gupta (Member)",
  ];

  const coursework = [
    { code: "CSE6010", name: "Advanced Algorithms", credits: 4, grade: "A" },
    { code: "CSE6011", name: "Machine Learning", credits: 4, grade: "A-" },
    { code: "CSE6012", name: "Database Systems", credits: 3, grade: "B+" },
  ];

  const swayamCourses = [
    { name: "Deep Learning Specialization", platform: "NPTEL", status: "Completed", certificate: true },
    { name: "Big Data Analytics", platform: "SWAYAM", status: "In Progress", certificate: false },
  ];

  const publications = [
    { 
      title: "Neural Networks for Medical Imaging: A Novel Approach", 
      journal: "IEEE Transactions on Medical Imaging", 
      year: "2022",
      link: "#" 
    },
    { 
      title: "Efficient Algorithms for Data Processing in Healthcare", 
      conference: "International Conference on Machine Learning", 
      year: "2021",
      link: "#" 
    },
  ];

  const comprehensiveExam = {
    status: "Scheduled",
    date: "October 15, 2023",
    evaluators: [
      "Dr. Anand Kumar",
      "Dr. Ramesh Iyer",
      "Dr. Suman Gupta",
      "Dr. Priyanka Sharma",
    ],
    topics: [
      "Advanced Data Structures",
      "Machine Learning Algorithms",
      "Neural Networks",
      "Research Methodology"
    ]
  };

  return (
    <Card className="shadow-soft border animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarImage src="/placeholder.svg" alt={scholar.name} />
            <AvatarFallback className="text-xl bg-primary/10 text-primary">
              {scholar.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{scholar.name}</CardTitle>
            <p className="text-muted-foreground mt-1">{scholar.regNo}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="courses">Courses</TabsTrigger> */}
            <TabsTrigger value="publications">Publications</TabsTrigger>
            {/* <TabsTrigger value="comprehensive">Comprehensive</TabsTrigger> */}
            <TabsTrigger value="swayam">SWAYAM</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" /> Personal Information
                  </h3>
                  <div className="bg-secondary/50 p-4 rounded-md space-y-2">
                    <div className="grid grid-cols-4">
                      <span className="text-sm text-muted-foreground col-span-1">Name:</span>
                      <span className="text-sm font-medium col-span-3">{scholar.name}</span>
                    </div>
                    <div className="grid grid-cols-4">
                      <span className="text-sm text-muted-foreground col-span-1">Reg No:</span>
                      <span className="text-sm font-medium col-span-3">{scholar.regNo}</span>
                    </div>
                    <div className="grid grid-cols-4">
                      <span className="text-sm text-muted-foreground col-span-1">Department:</span>
                      <span className="text-sm font-medium col-span-3">{scholar.department}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" /> Academic Information
                  </h3>
                  <div className="bg-secondary/50 p-4 rounded-md space-y-2">
                    <div className="grid grid-cols-4">
                      <span className="text-sm text-muted-foreground col-span-1">Guide:</span>
                      <span className="text-sm font-medium col-span-3">{scholar.guide}</span>
                    </div>
                    <div className="grid grid-cols-4">
                      <span className="text-sm text-muted-foreground col-span-1">Year:</span>
                      <span className="text-sm font-medium col-span-3">{scholar.admissionYear}</span>
                    </div>
                    <div className="grid grid-cols-4">
                      <span className="text-sm text-muted-foreground col-span-1">Area:</span>
                      <span className="text-sm font-medium col-span-3">{scholar.researchArea}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" /> DC Committee Members
                  </h3>
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <ul className="space-y-2">
                      {dcMembers.map((member, index) => (
                        <li key={index} className="text-sm">
                          {member}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* <div>
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Important Dates
                  </h3>
                  <div className="bg-secondary/50 p-4 rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Admission Date:</span>
                      <span className="text-sm font-medium">July 15, {scholar.admissionYear}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Next DC Meeting:</span>
                      <span className="text-sm font-medium">August 10, 2023</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Submission Deadline:</span>
                      <span className="text-sm font-medium">December 05, 2023</span>
                    </div>
                  </div> */}
                {/* </div> */}
              </div>
            </div>
          </TabsContent>
          
          {/* Courses Tab */}
          <TabsContent value="courses" className="pt-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" /> Coursework
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-secondary/70">
                        <th className="px-4 py-2 text-left text-sm font-medium">Course Code</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Course Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Credits</th>
                        <th className="px-4 py-2 text-left text-sm font-medium">Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coursework.map((course, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="px-4 py-3 text-sm">{course.code}</td>
                          <td className="px-4 py-3 text-sm">{course.name}</td>
                          <td className="px-4 py-3 text-sm">{course.credits}</td>
                          <td className="px-4 py-3 text-sm font-medium">{course.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Clipboard className="h-4 w-4" /> Course Progress Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-secondary/50 p-4 rounded-md text-center">
                    <div className="text-2xl font-semibold">11</div>
                    <div className="text-sm text-muted-foreground">Total Credits</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md text-center">
                    <div className="text-2xl font-semibold">3</div>
                    <div className="text-sm text-muted-foreground">Courses Completed</div>
                  </div>
                  <div className="bg-secondary/50 p-4 rounded-md text-center">
                    <div className="text-2xl font-semibold">A-</div>
                    <div className="text-sm text-muted-foreground">CGPA</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Publications Tab */}
          <TabsContent value="publications" className="pt-4">
            <div className="space-y-4">
              {publications.map((pub, index) => (
                <div key={index} className="bg-secondary/50 p-4 rounded-md">
                  <h3 className="font-medium">{pub.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {pub.journal || pub.conference} ({pub.year})
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {pub.journal ? "Journal" : "Conference"}
                    </Badge>
                    <a href={pub.link} className="text-sm text-primary ml-2 hover:underline">
                      View Publication
                    </a>
                  </div>
                </div>
              ))}
              
              {publications.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No publications recorded yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Comprehensive Exam Tab */}
          <TabsContent value="comprehensive" className="pt-4">
            <div className="space-y-6">
              <div className="bg-secondary/50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" /> Comprehensive Exam Status
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${comprehensiveExam.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : ''}
                      ${comprehensiveExam.status === 'Scheduled' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : ''}
                      ${comprehensiveExam.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300' : ''}
                    `}
                  >
                    {comprehensiveExam.status}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-4">
                    <span className="text-sm text-muted-foreground col-span-1">Date:</span>
                    <span className="text-sm font-medium col-span-3">{comprehensiveExam.date}</span>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Evaluators:</span>
                    <div className="flex flex-wrap gap-2">
                      {comprehensiveExam.evaluators.map((evaluator, index) => (
                        <Badge key={index} variant="secondary" className="font-normal">
                          {evaluator}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="text-sm text-muted-foreground block mb-2">Evaluation Topics:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {comprehensiveExam.topics.map((topic, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="bg-primary/10 p-1 rounded-full mt-0.5">
                            <FileText className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* SWAYAM Courses Tab */}
          <TabsContent value="swayam" className="pt-4">
            <div className="space-y-4">
              {swayamCourses.map((course, index) => (
                <div key={index} className="bg-secondary/50 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{course.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={course.status === 'Completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                      }
                    >
                      {course.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Platform: {course.platform}
                  </p>
                  {/* {course.certificate && (
                    <div className="mt-2">
                      <a href="#" className="text-sm text-primary hover:underline">
                        View Certificate
                      </a>
                    </div>
                  )} */}
                </div>
              ))}
              
              {swayamCourses.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No SWAYAM courses enrolled yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ScholarDetail;
