import React, { useState } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Uploader } from "./components/Uploader";
import { ImageGallery } from "./components/ImageGallery";
import { MarkdownCopy } from "./components/MarkdownCopy";

export default function App() {
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-gray-800">Markdown Image Generator</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Content 
            lastUploadedUrl={lastUploadedUrl}
            setLastUploadedUrl={setLastUploadedUrl}
          />
        </div>
      </main>
      <footer className="bg-white border-t py-6 px-4">
        <div className="max-w-4xl mx-auto text-center text-gray-600">
          <p className="text-sm">
            © 2024 paraFlux inc. | Built by Yue Zhou | 
            <a href="mailto:amirzhou001@gmail.com" className="text-blue-600 hover:text-blue-800 ml-1">
              amirzhou001@gmail.com
            </a>
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}

function Content({ 
  lastUploadedUrl, 
  setLastUploadedUrl 
}: { 
  lastUploadedUrl: string | null;
  setLastUploadedUrl: (url: string | null) => void;
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const images = useQuery(api.files.getImages);

  // Get the most recent image URL when images update
  React.useEffect(() => {
    if (images && images.length > 0) {
      const latestImage = images[0];
      if (latestImage.url) {
        setLastUploadedUrl(latestImage.url);
      }
    }
  }, [images, setLastUploadedUrl]);

  const handleImageClick = (imageUrl: string) => {
    setLastUploadedUrl(imageUrl);
  };

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Markdown Image Generator</h1>
        <Authenticated>
          <p className="text-xl text-gray-600">
            Welcome back, {loggedInUser?.email ?? "friend"}!
          </p>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-gray-600">Sign in to generate markdown-ready images</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <div className="flex justify-center">
          <SignInForm />
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="space-y-8">
          <Uploader onUploadSuccess={() => {}} />
          {lastUploadedUrl && <MarkdownCopy imageUrl={lastUploadedUrl} />}
          <ImageGallery onImageClick={handleImageClick} selectedUrl={lastUploadedUrl} />
        </div>
      </Authenticated>
    </div>
  );
}
