import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Student/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, X, Check, RotateCcw } from 'lucide-react';

const AddPublication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    journal: '',
    doi: '',
    publicationType: 'Q1',
    authors: [''],
    status: 'Submitted',
    sendCopyToCoordinator: false
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      sendCopyToCoordinator: checked
    }));
  };

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...formData.authors];
    newAuthors[index] = value;
    setFormData(prev => ({
      ...prev,
      authors: newAuthors
    }));
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, '']
    }));
  };

  const removeAuthor = (index) => {
    if (formData.authors.length > 1) {
      const newAuthors = [...formData.authors];
      newAuthors.splice(index, 1);
      setFormData(prev => ({
        ...prev,
        authors: newAuthors
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.journal.trim()) {
      newErrors.journal = 'Journal name is required';
    }
    if (!formData.doi.trim()) {
      newErrors.doi = 'DOI is required';
    } else if (!/^10\.\d{4,}\/\S+$/.test(formData.doi)) {
      newErrors.doi = 'Invalid DOI format (10.xxxx/xxxxx)';
    }
    if (formData.authors.some(author => !author.trim())) {
      newErrors.authors = 'All author fields must be filled';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form data submitted:', formData);
      toast({
        title: "Publication added successfully",
        description: "Your publication has been added to the log.",
      });
      navigate('/publication');
    }
  };

  const handleReset = () => {
    setFormData({
      title: '',
      journal: '',
      doi: '',
      publicationType: 'Q1',
      authors: [''],
      status: 'Submitted',
      sendCopyToCoordinator: false
    });
    setErrors({});
  };

  const handleBack = () => {
    navigate('/publication');
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Add Publication</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Publication Details</CardTitle>
            <CardDescription>
              Enter the details of your research paper or publication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doi" className="font-medium">
                    DOI Link <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="doi"
                    name="doi"
                    placeholder="Enter DOI link"
                    value={formData.doi}
                    onChange={handleInputChange}
                    className={errors.doi ? "border-destructive" : ""}
                  />
                  {errors.doi && (
                    <p className="text-sm text-destructive">{errors.doi}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title" className="font-medium">
                    Research Paper Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter the full title of your paper"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="journal" className="font-medium">
                    Journal Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="journal"
                    name="journal"
                    placeholder="Enter the journal name"
                    value={formData.journal}
                    onChange={handleInputChange}
                    className={errors.journal ? "border-destructive" : ""}
                  />
                  {errors.journal && (
                    <p className="text-sm text-destructive">{errors.journal}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publicationType" className="font-medium">
                    Type of Publication <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.publicationType} 
                    onValueChange={(value) => handleSelectChange('publicationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select publication type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1">Q1</SelectItem>
                      <SelectItem value="Q2">Q2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publicationType" className="font-medium">
                    Quartiles <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.publicationType} 
                    onValueChange={(value) => handleSelectChange('publicationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select publication type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Q1">Q1</SelectItem>
                      <SelectItem value="Q2">Q2</SelectItem>
                      <SelectItem value="Q3">Q3</SelectItem>
                      <SelectItem value="Q4">Q4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="font-medium">
                    Co-Authors <span className="text-destructive">*</span>
                  </Label>
                  {errors.authors && (
                    <p className="text-sm text-destructive">{errors.authors}</p>
                  )}
                  {formData.authors.map((author, index) => (
                    <div key={index} className="flex gap-2 items-center mt-2">
                      <Input
                        placeholder={`Author ${index + 1}`}
                        value={author}
                        onChange={(e) => handleAuthorChange(index, e.target.value)}
                        className={errors.authors ? "border-destructive" : ""}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeAuthor(index)}
                        disabled={formData.authors.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      {index === formData.authors.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={addAuthor}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-medium">
                    Publication Status <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Submitted">Submitted</SelectItem>
                      <SelectItem value="Editorial Revision">Editorial Revision</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="coordinator-copy"
                    checked={formData.sendCopyToCoordinator}
                    onCheckedChange={(checked) => handleSwitchChange(checked)}
                  />
                  <Label htmlFor="coordinator-copy" className="cursor-pointer">
                    Send copy to PhD Co-ordinator
                  </Label>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="gap-2">
                <Check className="h-4 w-4" />
                Submit
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default AddPublication;
