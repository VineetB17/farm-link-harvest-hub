
import React, { useState } from 'react';
import { Upload, Image } from 'lucide-react';
import { Button } from './button';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  bucketName?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, bucketName }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      // Generate a unique filename
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExtension}`;
      
      // Use the specified bucket or default to "equipment-images"
      const bucket = bucketName || "equipment-images";
      
      // Upload to Supabase Storage
      const { data, error } = await window.supabase.storage
        .from(bucket)
        .upload(fileName, file);
        
      if (error) throw error;
      
      // Get public URL
      const { data: urlData } = window.supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
        
      // Call onChange with the URL
      onChange(urlData.publicUrl);
      
    } catch (error: any) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {value ? (
        <div 
          className="relative w-full aspect-video cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleClick}
        >
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              console.error("Preview image failed to load:", value);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div 
            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity rounded-lg ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-white font-medium">{isUploading ? 'Uploading...' : 'Change Image'}</span>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleClick}
          variant="outline"
          className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-dashed"
          disabled={isUploading}
        >
          <Upload className="h-8 w-8" />
          <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
