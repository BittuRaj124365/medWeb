export const LoadingSkeleton = () => {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden h-[480px] flex flex-col animate-pulse shadow-sm">
      <div className="h-56 bg-gray-100 flex items-center justify-center p-8">
         <div className="w-24 h-24 bg-gray-200 rounded-2xl opacity-50"></div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-100 rounded-lg w-1/3"></div>
          <div className="h-4 bg-gray-100 rounded-full w-10"></div>
        </div>
        <div className="h-8 bg-gray-100 rounded-xl w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-50 rounded-lg w-1/2 mb-8"></div>
        
        <div className="mt-auto space-y-6 pt-6 border-t border-gray-50">
          <div className="flex justify-between items-end">
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-gray-50 rounded w-1/4"></div>
              <div className="h-8 bg-gray-100 rounded-lg w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-50 rounded w-1/4"></div>
          </div>
          <div className="h-14 bg-gray-100 rounded-2xl w-full"></div>
        </div>
      </div>
    </div>
  );
};

export const GraphSkeleton = () => {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm animate-pulse flex flex-col gap-8 h-[380px]">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
        <div className="h-6 bg-gray-100 rounded-lg w-1/3"></div>
      </div>
      <div className="flex-grow flex items-end gap-3 px-2">
        <div className="h-[40%] bg-gray-50 rounded-t-xl w-full"></div>
        <div className="h-[70%] bg-gray-100 rounded-t-xl w-full"></div>
        <div className="h-[50%] bg-gray-50 rounded-t-xl w-full"></div>
        <div className="h-[90%] bg-gray-100 rounded-t-xl w-full"></div>
        <div className="h-[60%] bg-gray-50 rounded-t-xl w-full"></div>
        <div className="h-[80%] bg-gray-100 rounded-t-xl w-full"></div>
      </div>
      <div className="h-4 bg-gray-50 rounded-lg w-full"></div>
    </div>
  );
};

export default LoadingSkeleton;
