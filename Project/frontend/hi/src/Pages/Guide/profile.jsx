import React from "react";
import PageLayout from "@/components/Guide/layout/Layout";
import ProfileOverview from "@/components/Guide/profile/ProfileOverview";
import ScholarsList from "@/components/Guide/profile/ScholarsList";
// import QuickActions from "@/components/profile/QuickActions";

const GUIDE_DATA = {
  name: "Dr. Anand Kumar",
  designation: "Associate Professor",
  department: "Department of Computer Science and Engineering",
  email: "anand.kumar@university.edu",
  phone: "+91 9876543210",
  address: "Room 304, CSE Block, University Campus, Bangalore - 560012",
  expertise: [
    "Artificial Intelligence",
    "Machine Learning",
    "Natural Language Processing",
    "Computer Vision",
    "Data Mining"
  ],
  totalScholars: 12,
  activeScholars: 8,
  completedScholars: 4
};

const Profileg= () => {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
        
        <ProfileOverview guide={GUIDE_DATA} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ScholarsList />
          </div>
          <div className="lg:col-span-1">
            {/* <QuickActions /> */}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profileg;
