import React, { useState, useEffect } from "react";
import PageLayout from "@/components/Guide/layout/Layout";
import ProfileOverview from "@/components/Guide/profile/ProfileOverview";
import ScholarsList from "@/components/Guide/profile/ScholarsList";
import axios from 'axios';

// Mock data - Keeping all other fields unchanged
const mockGuideData = {
  designation: "Associate Professor",
  department: "Department of Computer Science and Engineering",
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

const Profileg = () => {
  const [guideData, setGuideData] = useState(mockGuideData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuideData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8080/api/user/profile', {
          withCredentials: true
        });

        if (response.data && response.data.name && response.data.email) {
          setGuideData(prevData => ({
            ...prevData,
            name: response.data.name,
            email: response.data.email
          }));
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching guide data:', err);
        setError('Failed to load guide data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuideData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
        
        <ProfileOverview guide={guideData} />
        
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
