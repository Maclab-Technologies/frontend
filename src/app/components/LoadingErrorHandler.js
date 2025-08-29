const LoadingErrorHandler = ({ error, loading }) => {
  return (
    <>
      {loading && (
        <div className="py-10 flex justify-center items-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#a3d900] mx-auto mb-4"></div>
            {/* <p className="text-gray-600">Loading...</p> */}
          </div>
        </div>
      )}
      {error && (
        <div className="py-10 flex justify-center items-center">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <p className="text-red-600 text-base font-medium">{error}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default LoadingErrorHandler