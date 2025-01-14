export default function DayHeader({ dayIndex }) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <h3 className="font-medium text-gray-900 text-xs">Day {dayIndex + 1}</h3>
      <button className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200">
        Export
      </button>
    </div>
  );
}
