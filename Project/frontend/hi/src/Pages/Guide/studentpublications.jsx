import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ExternalLink } from 'lucide-react';
import PublicationStatus from '@/components/Guide/PublicationStatus';
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/Guide/layout/Layout";

const API_BASE_URL = "http://localhost:8080/api"; // Backend base URL

const StudentPublications = () => {
  const { rollNumber } = useParams(); // Extract roll number from URL
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [publications, setPublications] = useState([]);
  const [publicationCount, setPublicationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //console.log("Extracted rollNumber from URL:", rollNumber); // Debugging

  useEffect(() => {
    const fetchData = async () => {
      if (!rollNumber) {
        console.error("rollNumber is undefined or null!");
        setError("Invalid roll number.");
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching student details for rollNumber: ${rollNumber}`);
        const studentResponse = await axios.get(`${API_BASE_URL}/students/${rollNumber}`);
        console.log("Student Data:", studentResponse.data);
        setStudent(studentResponse.data);

        console.log(`Fetching publications for rollNumber: ${rollNumber}`);
        const publicationsResponse = await axios.get(`${API_BASE_URL}/publications/get/${rollNumber}`);
        console.log("Publications Data:", publicationsResponse.data);
        setPublications(publicationsResponse.data);
        

        console.log(`Fetching publication count for rollNumber: ${rollNumber}`);
        const countResponse = await axios.get(`${API_BASE_URL}/students/${rollNumber}/publications`);
        console.log("Publication Count:", countResponse.data);
        setPublicationCount(countResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [rollNumber]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      </PageLayout>
    );
  }

  if (!student) {
    return (
      <PageLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">Student not found.</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="page-container">
        <div className="max-w-full mx-auto">
          <div className="flex items-center mb-8">
            <div className="ml-5">
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-sm text-gray-500">Publications: {publicationCount}</p>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">ORCID: </span>
                <a 
                  href={`https://orcid.org/${student.orcid}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                >
                  {student.orcid}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Publications Table */}
          <div className="table-container">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DOI</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {publications.length > 0 ? (
                  publications.map((publication) => (
                    <tr key={publication.id}>
                     <td className="px-6 py-4 text-sm text-gray-500">
  {new Date(...publication.dateOfSubmission).toLocaleDateString()}
</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{publication.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{publication.journal}</td>
                      <td className="px-6 py-4">
                        <PublicationStatus status={publication.status} />
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a 
                          href={`https://doi.org/${publication.doi}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                        >
                          {publication.doi}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                      No publications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="absolute right-4 bottom-4">
        <Button variant="outline" onClick={() => navigate('/publicationsg')}>
          ← Back
        </Button>
      </div>
    </PageLayout>
  );
};

export default StudentPublications;
