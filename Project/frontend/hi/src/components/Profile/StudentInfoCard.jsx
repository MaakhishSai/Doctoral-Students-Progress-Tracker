import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Mail, Save, Upload, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const StudentInfoCard = ({ studentData, onUpdate }) => {
  const [editableData, setEditableData] = useState({
    orcidId: studentData.orcidId,
    researchArea: studentData.researchArea,
  });
  const [profileImage, setProfileImage] = useState(studentData.profilePicture);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate({
      ...editableData,
      profilePicture: profileImage,
    });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full glass">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Student Information</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* profile section */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handleImageClick}>
            <Avatar className="h-32 w-32 group-hover:opacity-80">
              <AvatarImage src={profileImage} alt={studentData.name} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-full">
              <Upload className="text-white h-6 w-6" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
          </div>
          <span className="text-sm text-muted-foreground">Click to upload photo</span>
        </div>
             {/* personal details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* name */}
            <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Full Name</label>
            <Input value={studentData.name} readOnly className="bg-muted/30" placeholder="Full Name" />
            </div>
            {/* Roll Number */}
            <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Roll Number</label>
            <Input value={studentData.rollNumber} readOnly className="bg-muted/30" placeholder="Roll Number" />
           
            </div>
            {/*Email */}
            <div className="space-y-2">
            <div className="relative">
            <label className="text-sm font-medium text-muted-foreground">Email</label>

              <Input value={studentData.email} readOnly className="bg-muted/30 pr-10" placeholder="Email" />
              <a href={`mailto:${studentData.email}`} className="absolute right-3 top-[60%] -translate-y-1/2 text-primary">
                <Mail className="h-5 w-5" />
              </a>
              
              </div>
            </div>
            {/* ORCID ID */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">ORCID ID</label>
            <Input
              name="orcidId"
              value={editableData.orcidId}
              onChange={handleChange}
              className="border-primary"
              placeholder="ORCID ID"
            />
            </div>
            {/* Degree */}
            <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Degree</label>
            <Input value={studentData.degree} readOnly className="bg-muted/30" placeholder="Degree" />
            </div>
            {/* Department */}
            <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Department</label>
            <Input value={studentData.department} readOnly className="bg-muted/30" placeholder="Department" />
            </div>
             {/* Date of Joining */}
            <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Date of Joining</label>
            <Input value={studentData.dateOfJoining} readOnly className="bg-muted/30" placeholder="Date of Joining" />
            </div>
            {/* Admission Scheme */}
            <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Admission Scheme</label>
            <Input value={studentData.admissionScheme} readOnly className="bg-muted/30" placeholder="Admission Scheme" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Major Area of Research</label>
            <Textarea 
            name="researchArea"
            value={editableData.researchArea}
            onChange={handleChange}
            className="border-primary"
            placeholder="Major Area of Research"
          />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentInfoCard;
