import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ImageGalleryProps {
  onImageClick: (imageUrl: string) => void;
  selectedUrl: string | null;
}

export function ImageGallery({ onImageClick, selectedUrl }: ImageGalleryProps) {
  const images = useQuery(api.files.getImages);

  if (images === undefined) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Images</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Images</h2>
      {images.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No images uploaded yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div 
              key={image._id} 
              className={`border rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                selectedUrl === image.url ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'
              }`}
              onClick={() => image.url && onImageClick(image.url)}
            >
              {image.url && (
                <img
                  src={image.url}
                  alt={`Uploaded ${image.format}`}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-2 text-sm text-gray-600">
                <div>Format: {image.format.toUpperCase()}</div>
                <div>
                  Uploaded: {new Date(image._creationTime).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
