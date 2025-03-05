import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Student/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search, FileText } from 'lucide-react';
import PublicationList from '@/components/Student/publications/PublicationList';

const samplePublications = [
  {
    id: 1,
    title: "Deep Learning Approaches for Natural Language Processing in Healthcare",
    journal: "IEEE Transactions on Medical Imaging",
    doi: "http://dx.doi.org/10.1093/ajae/aaq063",
    publicationType: "Q1",
    authors: ["John Doe", "Jane Smith", "Robert Johnson"],
    status: "Published",
    statusHistory: [
      { status: "Submitted", date: "2024-01-15" },
      { status: "Editorial Revision", date: "2024-02-20" },
      { status: "Accepted", date: "2024-03-10" },
      { status: "Published", date: "2024-04-05" }
    ],
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "Machine Learning Algorithms for Predictive Analysis in Engineering",
    journal: "Journal of Machine Learning Research",
    doi: "http://dx.doi.org/10.1011/ajae/aaq063",
    publicationType: "Q2",
    authors: ["Jane Smith", "Michael Brown"],
    status: "Accepted",
    statusHistory: [
      { status: "Submitted", date: "2024-03-22" },
      { status: "Editorial Revision", date: "2024-04-15" },
      { status: "Accepted", date: "2024-05-10" }
    ],
    createdAt: "2024-03-22"
  },
  {
    id: 3,
    title: "Novel Approaches to Quantum Computing Algorithms",
    journal: "Physical Review Letters",
    doi: "http://dx.doi.org/10.1093/a11/aaq063",
    publicationType: "Q1",
    authors: ["Robert Johnson", "Emily Davis", "David Wilson"],
    status: "Editorial Revision",
    statusHistory: [
      { status: "Submitted", date: "2024-05-30" },
      { status: "Editorial Revision", date: "2024-06-25" }
    ],
    createdAt: "2024-05-30"
  },
  {
    id: 4,
    title: "Sustainable Energy Sources: A Systematic Review",
    journal: "Renewable and Sustainable Energy Reviews",
    doi: "http://dx.doi.org/10.1093/ajae/aaq06311",
    publicationType: "Q3",
    authors: ["Emily Davis", "Thomas Anderson"],
    status: "Submitted",
    statusHistory: [
      { status: "Submitted", date: "2024-07-12" }
    ],
    createdAt: "2024-07-12"
  }
];

const Publications = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [publications, setPublications] = useState(samplePublications);
  const [filteredPublications, setFilteredPublications] = useState(samplePublications);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    if (searchValue === '') {
      setFilteredPublications(publications);
    } else {
      const filtered = publications.filter(pub => pub.title.toLowerCase().includes(searchValue));
      setFilteredPublications(filtered);
    }
  };

  const handleAddNewPublication = () => {
    navigate('/addpublication');
  };

  const handleUpdateStatus = (id, newStatus) => {
    const updatedPublications = publications.map(pub => {
      if (pub.id === id) {
        const newStatusHistory = [...pub.statusHistory, { status: newStatus, date: new Date().toISOString() }];
        return { ...pub, status: newStatus, statusHistory: newStatusHistory };
      }
      return pub;
    });
    setPublications(updatedPublications);
    setFilteredPublications(updatedPublications);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <Card className="card-transition">
          <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle className="text-2xl font-bold">Your Publications</CardTitle>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-8 w-full md:w-[250px]"
                />
              </div>
              <Button onClick={handleAddNewPublication} className="gap-2 whitespace-nowrap">
                <PlusCircle className="h-4 w-4" />
                Add New Publication
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <PublicationList publications={filteredPublications} onUpdateStatus={handleUpdateStatus} />
            {filteredPublications.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md border-dashed border-muted">
                <FileText className="w-10 h-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No publications found</h3>
                <p className="text-sm text-muted-foreground mt-1">Get started by adding your first publication.</p>
                <Button onClick={handleAddNewPublication} variant="outline" className="mt-4 gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Publication
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Publications;
