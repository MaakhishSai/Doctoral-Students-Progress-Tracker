import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Save, Mail } from 'lucide-react';

const DCInfoCard = ({ dcData, onUpdate }) => {
  const [editableData, setEditableData] = useState({
    chair: { ...dcData.chair },
    supervisor: { ...dcData.supervisor },
    members: [...dcData.members],
  });

  const handlePersonChange = (category, field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [category]: { ...prev[category], [field]: value },
    }));
  };

  const handleMemberChange = (id, field, value) => {
    setEditableData((prev) => ({
      ...prev,
      members: prev.members.map((member) =>
        member.id === id ? { ...member, [field]: value } : member
      ),
    }));
  };

  const addMember = () => {
    const newId = Date.now();
    setEditableData((prev) => ({
      ...prev,
      members: [...prev.members, { id: newId, name: '', email: '' }],
    }));
  };

  const removeMember = (id) => {
    setEditableData((prev) => ({
      ...prev,
      members: prev.members.filter((member) => member.id !== id),
    }));
  };

  const handleSave = () => {
    onUpdate(editableData);
  };

  return (
    <Card className="w-full p-4 border border-gray-200 shadow-md rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Doctoral Committee Information</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* DC Chair Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">DC Chair</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Name</label>
            <Input
              value={editableData.chair.name}
              placeholder="Name"
              onChange={(e) => handlePersonChange('chair', 'name', e.target.value)}
            />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Input
                value={editableData.chair.email}
                placeholder="Email"
                onChange={(e) => handlePersonChange('chair', 'email', e.target.value)}
              />
              {editableData.chair.email && (
                <a href={`mailto:${editableData.chair.email}`} className="absolute right-3 top-1/3 -translate-y-1/2 text-primary hover:text-primary/80">
                  <Mail className="h-5 w-5" />
                </a>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* PhD Supervisor Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">PhD Supervisor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Name</label>
            <Input
              value={editableData.supervisor.name}
              placeholder="Name"
              onChange={(e) => handlePersonChange('supervisor', 'name', e.target.value)}
            />
            </div>
            <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Input
                value={editableData.supervisor.email}
                placeholder="Email"
                onChange={(e) => handlePersonChange('supervisor', 'email', e.target.value)}
              />
              {editableData.supervisor.email && (
                <a href={`mailto:${editableData.supervisor.email}`} className="absolute right-3 top-1/3 -translate-y-1/2 text-primary hover:text-primary/80 custom-transition">
                  <Mail className="h-5 w-5" />
                </a>
              )}
              </div>
            </div>
          </div>
        </div>

        {/* DC Members Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">DC Members</h3>
            <Button onClick={addMember} variant="outline" size="sm" className="text-primary border-primary/40 hover:bg-primary/10">
              <Plus className="h-4 w-4 mr-1" />
              Add Member
            </Button>
          </div>

          {editableData.members.map((member, index) => (
            <div key={member.id} className="p-4 border border-gray-300 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Member {index + 1}</h4>
                {editableData.members.length > 2 && (
                  <Button onClick={() => removeMember(member.id)} variant="ghost" size="sm" className="text-red-500 hover:bg-red-100 h-8 w-8 p-0">
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Name</label>
                <Input
                  value={member.name}
                  placeholder="Member Name"
                  onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                <div className="relative">
                  <Input
                    value={member.email}
                    placeholder="Member Email"
                    onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                  />
                  {member.email && (
                    <a href={`mailto:${member.email}`} className="absolute right-3 top-1/3 -translate-y-1/2 text-primary hover:text-primary/80 custom-transition">
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {editableData.members.length === 0 && (
            <div className="text-center p-6 border border-dashed border-gray-400 rounded-lg">
              <p className="text-gray-500">No DC members added. Click 'Add Member' to add.</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end pt-4">
        <Button onClick={handleSave} className="gap-2 bg-primary text-white hover:bg-primary/90">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DCInfoCard;
