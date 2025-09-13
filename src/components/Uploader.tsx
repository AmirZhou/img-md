import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface UploaderProps {
  onUploadSuccess: () => void;
}

export function Uploader({ onUploadSuccess }: UploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const sendImage = useMutation(api.storage.sendImage);

  const validateAndSetFile = (file: File) => {
    // Validate file type
    if (file.type !== "image/svg+xml" && file.type !== "image/png") {
      toast.error("Please select only SVG or PNG files");
      return false;
    }
    setSelectedFile(file);
    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      validateAndSetFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Step 1: Get upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST file to upload URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`);
      }

      const { storageId } = await result.json();

      // Step 3: Save image record
      const format = selectedFile.type === "image/svg+xml" ? "svg" : "png";
      await sendImage({ storageId, format });

      // Trigger a refresh of the images to get the new URL
      // The parent component will handle getting the latest uploaded image URL
      onUploadSuccess();

      toast.success("Image uploaded successfully!");
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload for Markdown</h2>
      <div className="space-y-4">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="space-y-4">
            <div className="text-gray-500 text-4xl">
              📁
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragOver ? "Drop your file here" : "Drag and drop your file here"}
              </p>
              <p className="text-sm text-gray-500">or click to browse</p>
            </div>
            <input
              id="file-input"
              type="file"
              accept="image/svg+xml,image/png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              Select SVG or PNG file
            </label>
          </div>
        </div>
        
        {selectedFile && (
          <div className="text-sm text-gray-600">
            Selected: {selectedFile.name} ({selectedFile.type})
          </div>
        )}
        
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>
    </div>
  );
}
