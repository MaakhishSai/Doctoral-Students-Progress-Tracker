import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, FileText, Trash, ExternalLink, Info, Check, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const StatusBadge = ({ status }) => {
  let variant = "default";
  let customClass="";
  switch (status) {
    case "Submitted":
      variant = "secondary";
      customClass = "bg-gray-500 text-white";
      break;
    case "Editorial Revision":
      variant = "outline"; 
      customClass = "bg-yellow-500 text-white"; 
      break;
    case "Accepted":
      variant = "success";
      customClass = "bg-green-500 text-white";
      break;
    case "Published":
      variant = "blue";
      customClass = "bg-blue-500 text-white";
      break;
    default:
      variant = "outline";
  }
  
 return <Badge variant={variant} className={customClass}>{status}</Badge>;
};

const PublicationList = ({ publications, onUpdateStatus }) => {
  const [editingStatus, setEditingStatus] = useState({ id: null, status: null });

  const handleStatusChange = (publication, newStatus) => {
    setEditingStatus({ id: publication.id, status: newStatus });
  };

  const handleSaveStatus = (publication) => {
    if (editingStatus.id === publication.id && editingStatus.status) {
      onUpdateStatus?.(publication.id, editingStatus.status);
      toast.success(`Status updated to ${editingStatus.status}`);
      setEditingStatus({ id: null, status: null });
    }
  };

  const handleCancelEdit = () => {
    setEditingStatus({ id: null, status: null });
  };

  return (
    <div className="relative overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Title</TableHead>
            <TableHead className="w-[15%]">Journal</TableHead>
            <TableHead className="w-[15%]">Type</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[15%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {publications.map((publication) => (
            <TableRow key={publication.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {publication.title}
                <div className="text-xs text-muted-foreground mt-1">
                  DOI: {publication.doi}
                </div>
              </TableCell>
              <TableCell>{publication.journal}</TableCell>
              <TableCell>
                <Badge variant="outline">{publication.publicationType}</Badge>
              </TableCell>
              <TableCell>
                {editingStatus.id === publication.id ? (
                  <div className="flex flex-col space-y-2">
                    <Select 
                      value={editingStatus.status || publication.status} 
                      onValueChange={(value) => handleStatusChange(publication, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Editorial Revision">Editorial Revision</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveStatus(publication)} 
                        className="flex-1"
                      >
                        <Check className="h-3 w-3 mr-1" /> Save
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={handleCancelEdit} 
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <HoverCard>
                    <HoverCardTrigger>
                      <div className="flex items-center gap-1 cursor-help">
                        <div 
                          className="relative group" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingStatus({ id: publication.id, status: publication.status });
                          }}
                        >
                          <StatusBadge status={publication.status} />
                          <div className="absolute inset-0 bg-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer">
                            <RefreshCw className="h-3 w-3 text-primary" />
                          </div>
                        </div>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Status History</h4>
                        <div className="space-y-2">
                          {publication.statusHistory.map((history, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{history.status}:</span>
                              <span className="text-muted-foreground">
                                {new Date(history.date).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>Open DOI</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive">
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PublicationList;
