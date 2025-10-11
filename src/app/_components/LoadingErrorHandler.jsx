const LoadingErrorHandler = ({ error, errorMsg, reload, loading, children }) => {
  const refreshHandler = () => {
    window.location.reload()
  }
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-yellow-400/30 rounded-full animate-spin"></div>
            <div className="absolute top-2 left-2 w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <p className="text-white text-xl font-medium">Loading...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box size={32} className="text-red-400" />
          </div>
          <p className="text-white text-xl font-medium mb-2">
            {error}
          </p>
          { errorMsg && <p className="text-gray-400 mb-6">
            {errorMsg}
          </p>}
          {reload && <button
            onClick={refreshHandler}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-8 py-3 rounded-xl font-semibold hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </button>}
        </div>
      </div>
    );
  }

  return (children) ;
};

export default LoadingErrorHandler;
