import React, { useState } from "react";
import PageLayout from "@/components/Co-ordinator/layout/Layout";
import ScholarsList from "@/components/Guide/Scholars/ScholarList";
import ScholarDetail from "@/components/Guide/Scholars/ScholarDetail";

// Sample data for demonstration
const SAMPLE_SCHOLARS = [
  {
    id: "1",
    name: "Rahul Kumar",
    regNo: "P210020CS",
    department: "Computer Science and Engineering",
    researchArea: "Quantum Computing Applications in Cryptography",
    guide: "Dr. Anand Kumar",
    admissionYear: "2021",
  },
  {
    id: "2",
    name: "Priya Singh",
    regNo: "P222002CS",
    department: "Electrical Engineering",
    researchArea: "Machine Learning for Medical Diagnostics",
    guide: "Dr. Anand Kumar",
    admissionYear: "2022",
  },
  {
    id: "3",
    name: "Amit Patel",
    regNo: "P221802CS",
    department: "Electronics and Communication",
    researchArea: "Advanced Neural Networks for Image Recognition",
    guide: "Dr. Anand Kumar",
    admissionYear: "2022",
  },
  {
    id: "4",
    name: "Deepak Sharma",
    regNo: "P232010CS",
    department: "Mechanical Engineering",
    researchArea: "Sustainable Energy Systems Optimization",
    guide: "Dr. Anand Kumar",
    admissionYear: "2023",
  },
  {
    id: "5",
    name: "Meena Gupta",
    regNo: "P231907CS",
    department: "Chemical Engineering",
    researchArea: "Natural Language Processing for Regional Languages",
    guide: "Dr. Anand Kumar",
    admissionYear: "2023",
  },
];

const ScholarProfiless = () => {
  const [selectedScholarId, setSelectedScholarId] = useState(null);
  const [scholars] = useState(SAMPLE_SCHOLARS);

  const selectedScholar = scholars.find(scholar => scholar.id === selectedScholarId);

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Student Profiles</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ScholarsList 
              scholars={scholars}
              selectedScholarId={selectedScholarId}
              onScholarSelect={setSelectedScholarId}
            />
          </div>
          <div className="lg:col-span-2">
            {selectedScholar ? (
              <ScholarDetail scholar={selectedScholar} />
            ) : (
              <div className="h-full flex items-center justify-center p-8 border rounded-lg bg-secondary/30">
                <p className="text-muted-foreground">
                  Select a scholar from the list to view their profile.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ScholarProfiless;