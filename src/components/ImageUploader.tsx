import React, { useState, useRef } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
    onImageUpload: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            onImageUpload(null);
            setPreview(null);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="image-uploader" onClick={handleClick}>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            {preview ? (
                <img src={preview} alt="Profile Preview" className="image-preview" />
            ) : (
                <div className="upload-placeholder">
                    <span>Adjuntar Foto</span>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
