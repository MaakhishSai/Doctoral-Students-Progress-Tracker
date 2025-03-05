import { useState } from "react";
import { FileSpreadsheet, User, UserCog } from "lucide-react";
import Layout from "@/components/Co-ordinator/layout/Layout";
import FileUpload from "@/components/Co-ordinator/Fileupload";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [students, setStudents] = useState([]);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setUploadSuccess(false);
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);

    // Simulate processing Excel data
    setTimeout(() => {
      // Mock data after Excel processing
      const mockStudents = [
        {
          id: "P202300CS",
          name: "Rahul Kumar",
          guide: "Dr. Anil Sharma",
          email: "rahul.kumar@example.com",
        },
        {
          id: "P222300CS",
          name: "Priya Singh",
          guide: "Dr. Meena Gupta",
          email: "priya.singh@example.com",
        },
        {
          id: "P212300CS",
          name: "Amit Patel",
          guide: "Dr. Suresh Iyer",
          email: "amit.patel@example.com",
        },
        {
          id: "P232300CS",
          name: "Sunita Reddy",
          guide: "Dr. Anil Sharma",
          email: "sunita.reddy@example.com",
        },
        {
          id: "P232200CS",
          name: "Rajesh Verma",
          guide: "Dr. Lalita Rao",
          email: "rajesh.verma@example.com",
        },
      ];

      setStudents(mockStudents);
      setIsUploading(false);
      setUploadSuccess(true);
      
      toast.success("Student data has been successfully processed", {
        description: `${mockStudents.length} students imported from ${file.name}`,
      });
    }, 2000);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex items-center space-x-2 mb-2">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Upload Student-Guide List</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          Upload an Excel sheet containing student information and their assigned guides
        </p>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-border mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Excel File</h2>
          <FileUpload
            onFileSelect={handleFileSelect}
            accept=".xlsx,.xls,.csv"
            maxSize={5}
          />
          
          <div className="mt-6">
            <Button 
              onClick={handleUpload} 
              disabled={!file || isUploading || uploadSuccess}
              className="w-full sm:w-auto"
            >
              {isUploading ? "Processing..." : "Process Excel Data"}
            </Button>
          </div>
        </div>

        {uploadSuccess && students.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border animate-slide-up">
            <h2 className="text-xl font-semibold mb-4">Imported Students</h2>
            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted border-b border-border">
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Guide</th>
                    <th className="py-3 px-4 text-left">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
  {students.map((student) => (
    <tr key={student.id} className="hover:bg-muted/50 transition-colors">
      <td className="py-3 px-4">{student.id}</td>
      <td className="py-3 px-4">
      <span className="py-3 px-4 flex items-center space-x-2">
        <User className="h-4 w-4 text-muted-foreground" />
        <span>{student.name}</span>
        </span>
      </td>
      <td className="py-3 px-4 ">
      <span className="py-3 px-4 flex items-center space-x-2">
        <UserCog className="h-4 w-4 text-muted-foreground" />
        <span>{student.guide}</span>
        </span>
      </td>
      <td className="py-3 px-4">{student.email}</td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </div>
        )}

        {/* Instructions */}
        {/* {!uploadSuccess && (
          <div className="bg-muted/50 rounded-xl p-6 border border-border">
            <h3 className="text-lg font-medium mb-4">Upload Instructions</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                <span>Prepare your Excel file with columns for Student ID, Name, Guide, and Email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                <span>Ensure all required fields are filled for each student entry</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                <span>Upload the file using the form above (Max size: 5MB)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">4</span>
                <span>Click "Process Excel Data" to import the information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">5</span>
                <span>Review the imported data and confirm it's correct</span>
              </li>
            </ul>
          </div>
        )} */}
      </div>
    </Layout>
  );
};

export default UploadExcel;
