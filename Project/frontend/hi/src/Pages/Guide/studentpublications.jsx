import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
// import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header';
import PublicationStatus from '@/components/Guide/PublicationStatus';
import { Button } from "@/components/ui/button";
import { getStudentById, getPublicationsByStudentId } from '@/data/mockData';
import PageLayout from "@/components/Guide/layout/Layout";
import { useNavigate } from "react-router-dom";
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const StudentPublications = () => {
  const { id } = useParams();
      const navigate=useNavigate();
  const [student, setStudent] = useState(null);
  const [publications, setPublications] = useState([]);

  useEffect(() => {
    if (id) {
        const fetchedStudent = getStudentById(id);
        const fetchedPublications = getPublicationsByStudentId(id);
        
        setStudent(fetchedStudent);
        setPublications(fetchedPublications);
    }
  }, [id]);
  

  if (!student) {
    return (
        <PageLayout>
      <div className="flex h-screen">
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="page-container">
              <div className="max-w-full mx-auto">
                <p className="text-center text-gray-500 mt-10">Student not found.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
    <div className="flex h-screen">
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <main className="flex-1 overflow-y-auto animate-fade-in">
          <div className="page-container">
            <div className="max-w-full mx-auto">
              <div className="flex items-center mb-8">
                {/* <Avatar className="h-16 w-16" >
                  <AvatarImage src={student.profileImage} alt={student.name} />
                  <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar> */}
                <div className="ml-5">
                  <h2 className="text-2xl font-bold">{student.name}</h2>
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
              
              <div className="table-container animate-slide-in">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title of Paper
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title of Paper
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        type
                      </th>

                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DOI Link
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Co-Authors
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {publications.length > 0 ? (
                      publications.map((publication) => (
                        <tr key={publication.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(publication.date)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {publication.title}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {publication.journal}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <PublicationStatus status={publication.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {publication.type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {publication.coAuthors.join(', ')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          No publications found for this student.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
        <div className="absolute right-4 bottom-4">
              <Button variant="outline" onClick={() => navigate('/publicationsg')}>
                ← Back
              </Button>
            </div>
    </PageLayout>
  );
};

export default StudentPublications;
