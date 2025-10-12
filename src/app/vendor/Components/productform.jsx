
import { useState } from "react";
import {
  FaFileUpload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProductForm({
  product = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const [productName, setProductName] = useState(product?.name || "");
  const [productDescription, setProductDescription] = useState(
    product?.description || ""
  );
  const [productPrice, setProductPrice] = useState(product?.price || "");
  const [discountPercent, setDiscountPercentage] = useState(
    product?.discountPercent || ""
  );
  const [discountPrice, setDiscountPrice] = useState(
    product?.discountPrice || ""
  );
  const [category, setCategory] = useState(product?.category || "");
  const [minOrder, setMinOrder] = useState(product?.minOrder || "");
  const [productMaterial, setProductMaterial] = useState(
    product?.material || ""
  );
  const [selectedColors, setSelectedColors] = useState(product?.color || []);
  const [productImages, setProductImages] = useState([]);
  const [existingImages, setExistingImages] = useState(product?.images || []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + productImages.length > 5) {
      toast.error("You can only upload up to 5 images.");
      return;
    }

    const validImages = files.filter((file) =>
      ["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)
    );

    if (validImages.length !== files.length) {
      toast.warning(
        "Some files were not valid image formats and were skipped."
      );
    }

    setProductImages((prev) => [...prev, ...validImages]);
  };

  const handleRemoveImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      setProductImages(productImages.filter((_, i) => i !== index));
    }
  };

  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !productName ||
      !productDescription ||
      !productPrice ||
      !productMaterial ||
      selectedColors.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const productData = {
      name: productName,
      description: productDescription,
      price: parseFloat(productPrice),
      discountPercent: parseFloat(discountPercent) || 0,
      category,
      minOrder: parseInt(minOrder) || 0,
      material: productMaterial,
      color: selectedColors,
      images: productImages,
      existingImages,
    };

    onSubmit(productData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product name and category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Product Name
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="e.g. Business Cards"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          >
            <option value="">Select Category</option>
            <option value="Apparel">Apparel</option>
            <option value="Banners">Banners</option>
            <option value="Brochures">Brochures</option>
            <option value="Business Cards">Business Cards</option>
            <option value="Flyers">Flyers</option>
            <option value="Invitation Cards">Invitation Cards</option>
            <option value="Merchandise">Merchandise</option>
            <option value="Posters">Posters</option>
            <option value="Stationery">Stationery</option>
            <option value="Stickers">Stickers</option>
            <option value="shirt design">shirt design</option>
          </select>
        </div>
      </div>

      {/* Product description */}
      <div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Product description"
            required
            rows={6}
          ></textarea>
        </div>
      </div>

      {/* Product price, discount, and min order */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Price (₦) <span className="text-xs text-yellow-400">(per unit)</span>
          </label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="500.00"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Discount (%)
          </label>
          <input
            type="number"
            value={discountPercent}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="0"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Min Order Quantity
          </label>
          <div className="flex gap-2">
            <select
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select quantity</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
            <input
              type="number"
              min="1"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              className="w-32 bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Custom quantity"
            />
          </div>
        </div>
      </div>

      {/* Product material and color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Material
          </label>
          <input
            type="text"
            value={productMaterial}
            onChange={(e) => setProductMaterial(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="e.g. Glossy Paper, Matte, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Available Colors
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              "Red",
              "Blue",
              "Green",
              "Black",
              "White",
              "Yellow",
              "Full Color",
            ].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorToggle(color)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                    ${
                      selectedColors.includes(color)
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600"
                    }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Upload pictures */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Upload Images (Max 5)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <FaFileUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-yellow-400 hover:text-yellow-300 focus-within:outline-none"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5 files</p>
            {(productImages.length > 0 || existingImages.length > 0) && (
              <p className="text-sm text-green-400">
                {productImages.length + existingImages.length} images selected
              </p>
            )}
          </div>
        </div>
      </div>minimum quantity

      {/* Image previews */}
      <div className="flex flex-wrap gap-2 mt-4">
        {existingImages.map((image, index) => (
          <div key={`existing-${index}`} className="relative">
            <img
              src={image}
              alt={`existing-${index}`}
              className="w-24 h-24 object-cover rounded-md border border-gray-400"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index, true)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
        {productImages.map((file, index) => (
          <div key={`new-${index}`} className="relative">
            <img
              src={URL.createObjectURL(file)}
              alt={`upload-${index}`}
              className="w-24 h-24 object-cover rounded-md border border-gray-400"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white font-medium rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors disabled:opacity-70"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {product ? "Updating..." : "Creating..."}
            </span>
          ) : (
            <span>{product ? "Update Product" : "Create Product"}</span>
          )}
        </button>
      </div>
    </form>
  );
}
