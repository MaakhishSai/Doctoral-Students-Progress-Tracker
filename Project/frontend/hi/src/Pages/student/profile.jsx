import React, { useState } from 'react';
import Layout from '@/components/Student/layout/Layout';
import StudentInfoCard from '@/components/Student/Profile/StudentInfoCard';
import DCInfoCard from '@/components/Student/Profile/DCInfoCard';
import { useToast } from '@/hooks/use-toast';

// Mock student data - would come from API in a real app
const studentData = {
  profilePicture: '/placeholder.svg',
  name: 'Manhaas Nunna',
  rollNumber: 'P220545CS',
  email: 'man@example.edu',
  orcidId: '0000-0002-1825-0097',
  degree: 'PhD',
  department: 'CSED',
  dateOfJoining: 'August 15, 2022',
  admissionScheme: 'JRF',
  researchArea: 'Machine Learning and Artificial Intelligence for Healthcare Systems'
};

// Mock DC data - would come from API in a real app
const dcData = {
  chair: {
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@example.edu'
  },
  supervisor: {
    name: 'Dr. Priya Verma',
    email: 'priya.verma@example.edu'
  },
  members: [
    {
      id: 1,
      name: 'Dr. Sunil Mehta',
      email: 'sunil.mehta@example.edu'
    },

  ]
};

const Profile = () => {
  const [student, setStudent] = useState(studentData);
  const [dc, setDC] = useState(dcData);
  const { toast } = useToast();

  const handleStudentUpdate = (updatedData) => {
    setStudent({ ...student, ...updatedData });
    toast({
      title: "Profile updated",
      description: "Your information has been saved successfully.",
      duration: 3000,
    });
  };

  const handleDCUpdate = (updatedData) => {
    setDC({ ...dc, ...updatedData });
    toast({
      title: "Committee details updated",
      description: "DC information has been saved successfully.",
      duration: 3000,
    });
  };

  return (
    <Layout>
      <div className="w-full max-w-5xl mx-auto space-y-8 py-6">
        <h1 className="text-3xl font-semibold mb-6 text-primary">Profile Information</h1>

        <StudentInfoCard
          studentData={student}
          onUpdate={handleStudentUpdate}
        />

        <DCInfoCard
          dcData={dc}
          onUpdate={handleDCUpdate}
        />
      </div>
    </Layout>
  );
};

export default Profile;
