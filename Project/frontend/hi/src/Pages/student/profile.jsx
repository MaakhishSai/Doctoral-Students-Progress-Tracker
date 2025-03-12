import React, { useState, useEffect } from 'react';
import Layout from '@/components/Student/layout/Layout';
import StudentInfoCard from '@/components/Student/Profile/StudentInfoCard';
import DCInfoCard from '@/components/Student/Profile/DCInfoCard';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

// Mock student data - keep other fields unchanged
const mockStudentData = {
  profilePicture: '/placeholder.svg',
  rollNumber: 'P220545CS',
  orcidId: '0000-0002-1825-0097',
  degree: 'PhD',
  department: 'CSED',
  dateOfJoining: 'August 15, 2022',
  admissionScheme: 'JRF',
  researchArea: 'Machine Learning and Artificial Intelligence for Healthcare Systems'
};

// Mock DC data - remains unchanged
const mockDCData = {
  chair: {
    name: 'Dr. Rajesh Sharma',
    email: 'rajesh.sharma@example.edu'
  },
  supervisor: {
    name: 'Dr. Priya Verma',
    email: 'priya.verma@example.edu'
  },
  members: [
    { id: 1, name: 'Dr. Sunil Mehta', email: 'sunil.mehta@example.edu' }
  ]
};

const Profile = () => {
  const [student, setStudent] = useState(mockStudentData);
  const [dc, setDC] = useState(mockDCData);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/user/profile', {
          withCredentials: true
        });

        // Update only name and email in the student data
        setStudent(prevStudent => ({
          ...prevStudent,
          name: response.data.name,
          email: response.data.email
        }));

      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

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

  if (!student) return <div>Loading...</div>;

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
