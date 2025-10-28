const EmptyState = ({ icon, message, actionText, onAction }) => {
  return (
    <div className="bg-black bg-opacity-30 rounded-lg p-8 text-center border border-gray-700">
      <div className="text-4xl flex justify-center align-middle text-yellow-400 mx-auto mb-3 opacity-50">
        {icon}
      </div>
      <p className="text-gray-300">{message}</p>
      {actionText && (
        <button
          onClick={onAction}
          className="mt-4 text-yellow-400 hover:underline"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
