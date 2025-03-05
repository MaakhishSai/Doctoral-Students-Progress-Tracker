import React, { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { Course } from '@/types/courses';

// Mock course suggestions
const COURSE_SUGGESTIONS = [
  { id: 'AI201', name: 'Artificial Intelligence', credits: 4 },
  { id: 'ML301', name: 'Machine Learning', credits: 3 },
  { id: 'DL401', name: 'Deep Learning', credits: 3 },
  { id: 'NLP501', name: 'Natural Language Processing', credits: 4 },
  { id: 'DS201', name: 'Data Structures', credits: 3 },
  { id: 'ALG301', name: 'Algorithms', credits: 4 },
  { id: 'DB401', name: 'Database Systems', credits: 3 },
];



const CourseSearch= ({ onAddCourse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 0) {
      const filteredSuggestions = COURSE_SUGGESTIONS.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions(COURSE_SUGGESTIONS);
      setShowSuggestions(true);
    }
  }, [searchTerm]);

  const handleSelectCourse = (course) => {
    onAddCourse(course);
    setSearchTerm('');
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search for course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-[30%] transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Button 
          onClick={() => {
            if (suggestions.length > 0) {
              handleSelectCourse(suggestions[0]);
            }
          }}
          disabled={!(suggestions.length > 0)}
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          Add
        </Button>
      </div>
      
      {showSuggestions && (
        <div className="border rounded-md overflow-hidden">
          {suggestions.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto">
              {suggestions.map((course) => (
                <div 
                  key={course.id}
                  className="px-4 py-3 hover:bg-muted cursor-pointer flex justify-between items-center border-b last:border-0"
                  onClick={() => handleSelectCourse(course)}
                >
                  <div>
                    <div className="font-medium">{course.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <Badge variant="outline">{course.id}</Badge>
                      <span>{course.credits} credits</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Plus size={16} className="text-primary" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No courses found matching your search.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSearch;
