import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";




const ScholarsList = ({ 
  scholars, 
  selectedScholarId, 
  onScholarSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredScholars, setFilteredScholars] = useState(scholars);

  const handleSearch = () => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (!term.trim()) {
      setFilteredScholars(scholars);
      return;
    }
    
    const filtered = scholars.filter(scholar => 
      scholar.name.toLowerCase().includes(term.toLowerCase()) ||
      scholar.regNo.toLowerCase().includes(term.toLowerCase()) ||
      scholar.department.toLowerCase().includes(term.toLowerCase()) ||
      scholar.researchArea.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredScholars(filtered);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredScholars(scholars);
  };

  return (
    <Card className="shadow-soft border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          Scholars
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-9 h-9 w-48"
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
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {filteredScholars.length > 0 ? (
              filteredScholars.map(scholar => (
                <div 
                  key={scholar.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all-200 ${
                    selectedScholarId === scholar.id
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-secondary/50 border border-transparent hover:bg-secondary"
                  }`}
                  onClick={() => onScholarSelect(scholar.id)}
                >
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src="/placeholder.svg" alt={scholar.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {scholar.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <h3 className="font-medium truncate">{scholar.name}</h3>
                      <p className="text-sm text-muted-foreground">{scholar.regNo}</p>
                    </div>
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
