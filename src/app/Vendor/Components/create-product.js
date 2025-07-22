import { FaPlus } from 'react-icons/fa';

export default function CreateProduct({ 
  products, 
  showProductForm, 
  setShowProductForm, 
  ProductForm, 
  handleCreateProduct, 
  isSubmitting 
}) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Product</h1>
        <button
          onClick={() => setShowProductForm(true)}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors"
        >
          <FaPlus className="mr-1 inline" /> Create Product
        </button>
      </div>

      {products.length === 0 && !showProductForm && (
        <div className="text-center py-10">
          <p className="text-gray-400 mb-4">
            You haven't created any products yet
          </p>
          <button
            onClick={() => setShowProductForm(true)}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-md transition-colors"
          >
            Create Your First Product
          </button>
        </div>
      )}

      {showProductForm && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setShowProductForm(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}