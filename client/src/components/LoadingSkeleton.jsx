export const LoadingSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-[340px] flex flex-col animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="mt-auto flex justify-between">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
        </div>
      </div>
    </div>
  );
};

export const GraphSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse flex flex-col gap-4 h-[300px]">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-100 rounded w-1/3"></div>
        <div className="h-4 bg-gray-100 rounded w-10"></div>
      </div>
      <div className="flex-grow flex items-end gap-2 px-2">
        <div className="h-3/4 bg-gray-100 rounded w-full"></div>
        <div className="h-1/2 bg-gray-100 rounded w-full"></div>
        <div className="h-5/6 bg-gray-100 rounded w-full"></div>
        <div className="h-2/3 bg-gray-100 rounded w-full"></div>
        <div className="h-3/4 bg-gray-100 rounded w-full"></div>
      </div>
      <div className="h-4 bg-gray-100 rounded w-full"></div>
    </div>
  );
};

export default LoadingSkeleton;
