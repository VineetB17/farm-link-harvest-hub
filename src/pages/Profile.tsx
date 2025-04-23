
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import LendingBorrowingSection from '@/components/profile/LendingBorrowingSection';

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
  
  const lendingItems = [
    { id: '1', name: 'Tractor', category: 'Equipment', borrower: 'Green Valley Farms', dueDate: '2025-05-01', condition: 'Excellent' },
    { id: '2', name: 'Irrigation System', category: 'Equipment', borrower: 'Mountain View Farm', dueDate: '2025-04-20', condition: 'Good' },
    { id: '3', name: 'Seed Drill', category: 'Tools', borrower: 'Sunrise Agriculture', dueDate: '2025-04-25', condition: 'Fair' },
  ];
  
  const borrowingItems = [
    { id: '1', name: 'Harvester', category: 'Equipment', lender: 'Valley Farm Co.', dueDate: '2025-04-15', lentSince: '2025-03-15' },
    { id: '2', name: 'Seed Spreader', category: 'Tools', lender: 'Green Fields Ltd', dueDate: '2025-04-25', lentSince: '2025-03-25' },
    { id: '3', name: 'Sprinkler System', category: 'Irrigation', lender: 'Farm Tech Solutions', dueDate: '2025-05-05', lentSince: '2025-04-05' },
  ];

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

      <LendingBorrowingSection 
        lendingItems={lendingItems}
        borrowingItems={borrowingItems}
      />
    </div>
  );
};

export default Profile;
