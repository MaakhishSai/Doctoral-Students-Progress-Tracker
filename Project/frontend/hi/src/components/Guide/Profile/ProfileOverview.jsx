import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Award, Briefcase, UserCheck } from "lucide-react";



const ProfileOverview= ({ guide }) => {
  return (
    <Card className="shadow-soft border animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Profile Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32 border-2 border-border shadow-soft">
              <AvatarImage src="/placeholder.svg" alt={guide.name} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {guide.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-medium">{guide.name}</h2>
              <p className="text-muted-foreground">{guide.designation}</p>
              <p className="text-sm text-muted-foreground">{guide.department}</p>
            </div>
          </div>
          
          <Separator orientation="vertical" className="hidden md:block" />
          
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{guide.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{guide.phone}</span>
              </div>
              {/* <div className="flex items-center gap-2 col-span-full">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{guide.address}</span>
              </div> */}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" /> Areas of Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {guide.expertise.map((item, index) => (
                  <Badge key={index} variant="secondary" className="transition-all-200 hover:bg-accent hover:text-accent-foreground cursor-default">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-secondary rounded-md transition-all-200 hover:shadow-medium">
                <div className="text-2xl font-semibold">{guide.totalScholars}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Briefcase className="h-3 w-3" /> Total Scholars
                </div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-md transition-all-200 hover:shadow-medium">
                <div className="text-2xl font-semibold">{guide.activeScholars}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <UserCheck className="h-3 w-3" /> Active
                </div>
              </div>
              <div className="text-center p-3 bg-secondary rounded-md transition-all-200 hover:shadow-medium">
                <div className="text-2xl font-semibold">{guide.completedScholars}</div>
                <div className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Award className="h-3 w-3" /> Completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverview;
