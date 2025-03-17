import React, { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import axios from "axios";

const PageLayout = ({ children }) => {
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/user/super", {
          withCredentials: true,
        });
        setStudentName(response.data.name);
      } catch (error) {
        console.error("Error fetching student name:", error);
      }
    };

    fetchStudentName();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header studentName={studentName} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
