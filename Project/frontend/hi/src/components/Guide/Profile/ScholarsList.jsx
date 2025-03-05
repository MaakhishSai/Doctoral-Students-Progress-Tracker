import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, FilterX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";



const SCHOLARS= [
  {
    id: "1",
    name: "Rahul Kumar",
    regNo: "P210020CS",
    status: "Active",
    research: "Quantum Computing Applications in Cryptography"
  },
  {
    id: "2",
    name: "Priya Singh",
    regNo: "P222002CS",
    status: "Active",
    research: "Machine Learning for Medical Diagnostics"
  },
  {
    id: "3",
    name: "Amit Patel",
    regNo: "P211802CS",
    status: "Completed",
    research: "Advanced Neural Networks for Image Recognition"
  },
  {
    id: "4",
    name: "Deepak Sharma",
    regNo: "P231802CS",
    status: "Active",
    research: "Sustainable Energy Systems Optimization"
  },

];

const ScholarsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredScholars, setFilteredScholars] = useState(SCHOLARS);

  const handleSearch = () => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredScholars(SCHOLARS);
      return;
    }
    
    const filtered = SCHOLARS.filter(scholar => 
      scholar.name.toLowerCase().includes(term.toLowerCase()) ||
      scholar.regNo.toLowerCase().includes(term.toLowerCase()) ||
      scholar.research.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredScholars(filtered);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredScholars(SCHOLARS);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "On Leave": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <Card className="shadow-soft border mt-6 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">My Scholars</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search scholars..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-1 top-1 h-7 w-7" 
                  onClick={resetSearch}
                >
                  <FilterX className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {filteredScholars.length > 0 ? (
              filteredScholars.map(scholar => (
                <div 
                  key={scholar.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/5 transition-all-200"
                >
                  <Avatar className="h-12 w-12 border border-border">
                    <AvatarImage src="/placeholder.svg" alt={scholar.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {scholar.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3 className="font-medium truncate">{scholar.name}</h3>
                        <p className="text-sm text-muted-foreground">{scholar.regNo}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(scholar.status)}>
                        {scholar.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm mt-1 text-muted-foreground truncate">{scholar.research}</p>
                    
                    {/* <div className="mt-2 w-full bg-secondary h-1.5 rounded-full overflow-hidden"> */}
                      {/* <div 
                        className="h-full bg-primary"
                        style={{ width: `${scholar.progress}%` }}
                      /> */}
                    {/* </div> */}
                    {/* <p className="text-xs text-right mt-1 text-muted-foreground">
                      Progress: {scholar.progress}%
                    </p> */}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground mb-2">No scholars found matching your search.</p>
                <Button variant="outline" size="sm" onClick={resetSearch}>
                  Reset Search
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ScholarsList;
