export default function DistancePrice({ pax }) {
  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Distance:</span>
        <div className="flex items-center gap-1">
          <input
            type="text"
            className="w-16 text-right text-xs p-1 border border-gray-200 rounded focus:outline-none focus:border-blue-300"
            placeholder="0.00"
          />
          <span className="text-xs text-gray-500">km</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Price:</span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-blue-600">0</span>
          <span className="text-xs text-blue-600">đ</span>
        </div>
      </div>
    </div>
  );
}
