"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UploadDesignPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productType, setProductType] = useState("");
  const [designId, setDesignId] = useState("");

  const productTypes = [
    "T-Shirt",
    "Hoodie",
    "Poster",
    "Mug",
    "Phone Case",
    "Stickers",
    "Canvas Print"
  ];

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml", "application/pdf"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a JPG, PNG, SVG, or PDF file");
      return;
    }

    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileChange({ target: { files: e.dataTransfer.files } });
  }, [handleFileChange]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeFile = useCallback(() => {
    setFile(null);
    setPreview(null);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please upload a design file");
      return;
    }
    
    if (!productType) {
      toast.error("Please select a product type");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, you would upload to your backend here
      const formData = new FormData();
      formData.append("design", file);
      formData.append("instructions", instructions);
      formData.append("productType", productType);
      formData.append("designId", designId || `DSG-${Date.now()}`);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage (replace with actual API call in production)
      const designData = {
        id: designId || `DSG-${Date.now()}`,
        productType,
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + "MB",
        instructions,
        status: "Awaiting Admin Review",
        submittedAt: new Date().toISOString(),
        preview: preview
      };
      
      const existingDesigns = JSON.parse(localStorage.getItem("userDesigns") || "[]");
      localStorage.setItem("userDesigns", JSON.stringify([...existingDesigns, designData]));

      // Show success message
      toast.success("Design uploaded successfully! Awaiting admin review.", {
        position: "top-center",
        autoClose: 3000
      });

      // Redirect after delay
      setTimeout(() => {
        router.push("/my-designs"); // or "/cart" depending on your flow
      }, 2000);

    } catch (error) {
      toast.error("Failed to upload design. Please try again.", {
        position: "top-center"
      });
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Upload Your Design</h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have a print-ready design file? Upload it here.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type <span className="text-red-500">*</span>
            </label>
            <select
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
              required
            >
              <option value="">Select a product</option>
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

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
              Design File <span className="text-red-500">*</span>
            </label>
            <div
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                !file ? "border-gray-300 hover:border-yellow-400" : "border-yellow-400"
              } transition-colors`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <div className="space-y-1 text-center">
                {!file ? (
                  <>
                    <div className="flex justify-center">
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    </div>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/jpeg, image/png, image/svg+xml, application/pdf"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, SVG, or PDF up to 5MB
                    </p>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    {preview ? (
                      <div className="relative mb-4">
                        <img
                          src={preview}
                          alt="Design preview"
                          className="max-h-48 max-w-full rounded-md"
                        />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-4">
                        <span className="font-medium text-gray-700 mr-2">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    <label
                      htmlFor="file-upload"
                      className="text-sm text-yellow-600 hover:text-yellow-500 cursor-pointer"
                    >
                      Choose a different file
                    </label>
                  </div>
                )}
              </div>
            </div>
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
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Uploading...
                </>
              ) : (
                "Submit Design"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}