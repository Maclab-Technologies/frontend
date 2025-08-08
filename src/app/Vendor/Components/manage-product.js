import LoadingMiddleware from "@/app/middleware/loading-middleware";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

export default function ManageProducts({
  products,
  handleEditProduct,
  handleDeleteClick,
  showProductForm,
  productToEdit,
  handleCancelEdit,
  ProductForm,
  handleUpdateProduct,
  isSubmitting,
  showDeleteModal,
  DeleteConfirmationModal,
  productToDelete,
  handleConfirmDelete,
  handleCancelDelete,
  isDeleting,
  loading,
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white relative">
      <h1 className="text-2xl font-bold mb-6">Manage Your Products</h1>

      {loading && <LoadingMiddleware />}
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-400">
            No products available. Create your first product!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden"
            >
              <div className="w-full h-48 bg-gray-800">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <div className="text-right">
                    <p className="font-bold text-yellow-400">
                      ₦{product.discountPrice?.toLocaleString()}
                    </p>
                    <p className="text-sm line-through text-red-400">
                      ₦{product.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.color &&
                    product.color.map((color, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-700 text-xs rounded-full"
                      >
                        {color}
                      </span>
                    ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>Material: {product.material}</span>
                  <span>Min Order: {product.minOrder}</span>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Form Modal */}
      {showProductForm && productToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Product</h2>
              <button
                onClick={handleCancelEdit}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <ProductForm
              product={productToEdit}
              onSubmit={handleUpdateProduct}
              onCancel={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          product={productToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
