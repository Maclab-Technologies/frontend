const ActivitySkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-gray-700 rounded-lg p-3 h-16 animate-pulse"
        ></div>
      ))}
    </div>
  );
};

export default ActivitySkeleton;
