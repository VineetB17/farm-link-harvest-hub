
import React from 'react';
import { User } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  isEditing: boolean;
  onEditClick: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, isEditing, onEditClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-8">
      <div className="flex items-center">
        <div className="bg-farmlink-primary w-16 h-16 rounded-full flex items-center justify-center">
          <User className="text-white" size={28} />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl md:text-3xl font-bold text-farmlink-secondary">My Profile</h1>
          <p className="text-gray-600">Welcome, {name}</p>
        </div>
      </div>
      
      <button 
        onClick={onEditClick}
        className="flex items-center px-4 py-2 bg-farmlink-primary text-white rounded-md hover:bg-farmlink-secondary transition-colors"
      >
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </button>
    </div>
  );
};

export default ProfileHeader;
