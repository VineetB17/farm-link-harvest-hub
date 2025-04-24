
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { User, MapPin, Mail, Phone, Building2, Globe } from 'lucide-react';

interface ProfileFormData {
  name: string;
  farmName: string;
  location: string;
  phone: string;
  email: string;
  website: string;
}

interface ProfileDetailsProps {
  isEditing: boolean;
  formData: ProfileFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ isEditing, formData, onInputChange }) => {
  return (
    <Card className="md:col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Profile Details</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input name="name" value={formData.name} onChange={onInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Farm Name</label>
              <Input name="farmName" value={formData.farmName} onChange={onInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <Input name="location" value={formData.location} onChange={onInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input name="phone" value={formData.phone} onChange={onInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input name="email" value={formData.email} disabled />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <Input name="website" value={formData.website} onChange={onInputChange} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <User size={20} className="text-farmlink-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Full Name</h3>
                <p>{formData.name || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Building2 size={20} className="text-farmlink-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Farm Name</h3>
                <p>{formData.farmName || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <MapPin size={20} className="text-farmlink-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Location</h3>
                <p>{formData.location || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Mail size={20} className="text-farmlink-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Email</h3>
                <p>{formData.email || 'Not set'}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Phone size={20} className="text-farmlink-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Phone</h3>
                <p>{formData.phone || 'Not set'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Globe size={20} className="text-farmlink-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-gray-700">Website</h3>
                <p>{formData.website || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileDetails;
