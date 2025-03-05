import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const CourseCard = ({ 
  course, 
  onRemove, 
  showStatus = false,
  showDetails = false,
  onViewDetails 
}) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Applied':
        return 'secondary';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="card-transition w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{course.name}</h3>
              {showStatus && course.status && (
                <Badge variant={getStatusVariant(course.status)}>
                  {course.status}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <Badge variant="outline">{course.id}</Badge>
              <span>{course.credits} credits</span>
              {course.appliedDate && (
                <span>Applied: {new Date(course.appliedDate).toLocaleDateString()}</span>
              )}
            </div>
            {course.description && (
              <p className="mt-2 text-sm text-muted-foreground">{course.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1">
            {showDetails && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={() => onViewDetails && onViewDetails(course)}
              >
                <ExternalLink size={16} />
              </Button>
            )}
            {onRemove && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                onClick={() => onRemove(course.id)}
              >
                <X size={16} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
