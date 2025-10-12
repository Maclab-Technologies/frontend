"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UploadCloud, X, Loader2, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { uploadWithProgress } from "@/app/_hooks/uploadfile";

const MAX_FILES = 5;

export default function UploadDesignPage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designId, setDesignId] = useState("");
  const searchParams = useSearchParams();
  const [orderId, ref] = searchParams.getAll("orderid", "ref");

  useEffect(() => {
    setDesignId(orderId);
  }, [orderId]);

  const validateFile = (file) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "application/pdf",
    ];

    if (!validTypes.includes(file.type)) {
      toast.error(`${file.name}: Please upload a JPG, PNG, SVG, or PDF file`);
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${file.name}: File size must be less than 5MB`);
      return false;
    }

    return true;
  };

  const createFileObject = (file) => {
    return new Promise((resolve) => {
      const fileObj = {
        file,
        id: `${Date.now()}-${Math.random()}`,
        preview: null,
      };

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          fileObj.preview = reader.result;
          resolve(fileObj);
        };
        reader.readAsDataURL(file);
      } else {
        resolve(fileObj);
      }
    });
  };

  const handleFileChange = useCallback(
    async (e) => {
      const selectedFiles = Array.from(e.target.files);
      if (!selectedFiles.length) return;

      if (files.length + selectedFiles.length > MAX_FILES) {
        toast.error(`You can only upload up to ${MAX_FILES} files`);
        return;
      }

      const validFiles = selectedFiles.filter(validateFile);
      if (validFiles.length === 0) return;

      const fileObjects = await Promise.all(validFiles.map(createFileObject));

      setFiles((prev) => [...prev, ...fileObjects]);
    },
    [files.length]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleFileChange({ target: { files: e.dataTransfer.files } });
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeFile = useCallback((fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      toast.error("Please upload at least one design file");
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("userToken");

    if (!token) {
      toast.error("You must be logged in to upload designs.");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();

      files.forEach((item) => {
        const file = item instanceof File ? item : item.file; // ✅ ensure real File
        formData.append("design", file);
      });

      formData.append("instructions", instructions);
      formData.append("orderId", designId || `DSG-${Date.now()}`);
      formData.append("payRef", ref || "Null");

      // Debugging (optional)
      for (let [k, v] of formData.entries()) console.log(k, v);

      const result = await uploadWithProgress(
        "/orders/upload",
        formData,
        (progress) => console.log(`Upload progress: ${progress}%`),
        { token }
      );

      if (result.success) {
        toast.success(
          "Design(s) uploaded successfully! Awaiting admin review."
        );
        setTimeout(() => router.push("/my-designs"), 2000);
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload design. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAddMore = files.length < MAX_FILES;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Upload Your Design
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have print-ready design files? Upload up to {MAX_FILES}{" "}
            files here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Design ID (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Design ID (Optional)
            </label>
            <input
              type="text"
              value={designId}
              onChange={(e) => setDesignId(e.target.value)}
              placeholder="Existing design reference"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Design Files <span className="text-red-500">*</span>
              <span className="text-gray-500 text-xs ml-2">
                ({files.length}/{MAX_FILES})
              </span>
            </label>

            {/* Upload Area */}
            {canAddMore && (
              <div
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                  files.length === 0
                    ? "border-gray-300 hover:border-yellow-400"
                    : "border-yellow-400"
                } transition-colors`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="space-y-1 text-center">
                  <div className="flex justify-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  </div>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none"
                    >
                      <span>Upload file(s)</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/jpeg, image/png, image/svg+xml, application/pdf"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    JPG, PNG, SVG, or PDF up to 5MB each
                  </p>
                </div>
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-4 space-y-3">
                {files.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-400 transition-colors"
                  >
                    {fileObj.preview ? (
                      <img
                        src={fileObj.preview}
                        alt={fileObj.file.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileObj.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(fileObj.id)}
                      className="flex-shrink-0 text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}

                {canAddMore && (
                  <label
                    htmlFor="file-upload-more"
                    className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-yellow-400 transition-colors"
                  >
                    <UploadCloud className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Add more files
                    </span>
                    <input
                      id="file-upload-more"
                      name="file-upload-more"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/jpeg, image/png, image/svg+xml, application/pdf"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions (Optional)
            </label>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Any special notes for our team about your design..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting || files.length === 0}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                isSubmitting || files.length === 0
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                `Submit ${files.length} Design${files.length !== 1 ? "s" : ""}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
