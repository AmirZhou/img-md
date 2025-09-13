import { useState } from "react";
import { toast } from "sonner";

interface MarkdownCopyProps {
  imageUrl: string;
}

export function MarkdownCopy({ imageUrl }: MarkdownCopyProps) {
  const [copied, setCopied] = useState(false);

  const markdownText = `![paraFlux inc. Image](${imageUrl})`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdownText);
      setCopied(true);
      toast.success("Markdown copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-semibold mb-4">Markdown Ready</h2>
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-md p-4">
          <code className="text-sm text-gray-800 break-all">
            {markdownText}
          </code>
        </div>
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 rounded-md transition-colors ${
            copied
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {copied ? "Copied!" : "Copy Markdown"}
        </button>
      </div>
    </div>
  );
}
