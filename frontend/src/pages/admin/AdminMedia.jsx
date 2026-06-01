import { useState } from 'react';
import { FiUploadCloud, FiImage, FiCopy, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import AdminLayout from '@components/admin/AdminLayout';
import uploadService from '@services/upload-service';
import apiClient from '@services/api-client';

/**
 * AdminHeroBanner Component - Thay thế AdminMedia
 * Upload và quản lý ảnh Hero Banner
 */
const AdminMedia = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadService.uploadFile(file);
      
      if (response.success && response.data) {
        setUploadedFile(response.data);
        
        // Cập nhật Banner vào Backend
        try {
          await apiClient.post('/banners', { imageUrl: response.data.url });
          toast.success('Hero banner updated successfully');
        } catch (bannerErr) {
          console.error('Banner update error:', bannerErr);
          toast.error('Uploaded but failed to set as banner');
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-black tracking-tight text-dark-950">
              Hero Banner Manager
            </h1>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Change the main banner displayed on the home page
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div 
          className={`
            border-2 border-dashed rounded-2xl p-12 text-center transition-all bg-white
            ${dragActive 
              ? 'border-sneaker-orange bg-orange-50/50 scale-[1.02]' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleChange}
            accept="image/*"
          />
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${uploading ? 'animate-pulse bg-orange-100 text-sneaker-orange' : 'bg-gray-100 text-gray-500'}`}>
              <FiUploadCloud size={32} />
            </div>
            
            <div>
              <p className="text-lg font-bold text-dark-950 mb-1">
                {uploading ? 'Uploading...' : 'Drag & drop or click to upload'}
              </p>
              <p className="text-sm font-medium text-gray-500">
                Supports: JPG, PNG, WEBP (Max 5MB)
              </p>
            </div>

            <label
              htmlFor="file-upload"
              className={`
                px-6 py-2.5 bg-dark-950 text-white rounded-xl text-sm font-semibold cursor-pointer
                hover:bg-sneaker-orange transition-all shadow-sm
                ${uploading ? 'opacity-50 pointer-events-none' : ''}
              `}
            >
              Browse Files
            </label>
          </div>
        </div>

        {/* Upload Result */}
        {uploadedFile && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-dark-950 mb-6 flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <FiCheck size={16} />
              </span>
              <span>Upload Complete</span>
            </h3>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center overflow-hidden aspect-video">
                <img 
                  src={uploadedFile.url} 
                  alt="Uploaded banner" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    File Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 font-medium text-sm text-dark-950 break-all">
                    {uploadedFile.filename}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Public URL
                  </label>
                  <div className="flex">
                    <div className="flex-1 p-3 bg-gray-50 rounded-l-xl border border-gray-100 border-r-0 font-medium text-sm text-dark-950 break-all">
                      {uploadedFile.url}
                    </div>
                    <button
                      onClick={() => copyToClipboard(uploadedFile.url)}
                      className="px-4 bg-dark-950 text-white rounded-r-xl hover:bg-sneaker-orange transition-colors flex items-center justify-center"
                      title="Copy URL"
                    >
                      <FiCopy />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
