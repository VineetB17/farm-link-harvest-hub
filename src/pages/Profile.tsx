
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import { User } from '@/types/user'; // Import our extended User type

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    farmName: user?.farmName || '',
    location: user?.location || '',
    phone: user?.phone || '',
    email: user?.email || '',
    website: user?.website || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSaveProfile();
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated",
    });
  };

  return (
    <div className="farmlink-container py-10">
      <ProfileHeader 
        name={formData.name}
        isEditing={isEditing}
        onEditClick={handleEditToggle}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ProfileDetails 
          isEditing={isEditing}
          formData={formData}
          onInputChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default Profile;
