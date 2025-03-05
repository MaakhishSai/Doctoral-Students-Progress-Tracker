import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Users, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Calendar,
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const Sidebar= ({ className }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboardc', icon: LayoutDashboard },
    // { name: 'Add Students', href: '/add-students', icon: UserPlus },
    { name: 'Upload ExcelSheet', href: '/Excelpage', icon: GraduationCap },
    { name: 'Swayam Courses', href: '/Cocourses', icon: BookOpen },
    { name: 'Comprehensive Exam requests', href: '/co-comprehensive-exam', icon: CheckCircle },
  ];

  return (
    <div className={cn(
      "flex flex-col h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border relative transition-all-300",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="p-4 h-16 flex items-center justify-between">
        {!collapsed && (
          <h1 className="font-semibold text-lg">Phd Connect</h1>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex-1 py-4 overflow-y-auto scrollbar-hidden">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            
            return collapsed ? (
              <TooltipProvider key={item.name}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center justify-center p-3 rounded-md transition-all-200",
                        isActive 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <item.icon size={20} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all-200",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4">
        <Link to="/" className={cn(
          "flex items-center py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-all-200",
          collapsed ? "justify-center px-3" : "px-3"
        )}>
          <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
          {!collapsed && "Logout"}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
