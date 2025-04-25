
import React, { useState } from 'react';
import { Upload, Image } from 'lucide-react';
import { Button } from './button';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  previewUrl?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, previewUrl }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
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
      
      {previewUrl ? (
        <div 
          className="relative w-full aspect-video cursor-pointer"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleClick}
        >
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover rounded-lg"
            onError={(e) => {
              console.error("Preview image failed to load:", previewUrl);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div 
            className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity rounded-lg ${
              isHovering ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <span className="text-white font-medium">Change Image</span>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleClick}
          variant="outline"
          className="w-full aspect-video flex flex-col items-center justify-center gap-2 border-dashed"
        >
          <Upload className="h-8 w-8" />
          <span>Upload Image</span>
        </Button>
      )}
    </div>
  );
};

export default ImageUpload;
