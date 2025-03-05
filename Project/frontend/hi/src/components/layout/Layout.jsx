import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  // Mock student name - in a real app, this would come from authentication
  const studentName = "John Doe";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (Always Visible) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header studentName={studentName} />

        <main className="flex-1 p-6 overflow-x-hidden animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
