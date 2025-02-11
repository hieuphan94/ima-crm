export default function Todo() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">To Do List</h2>
      <div className="bg-white rounded-lg shadow p-4">
        {/* Todo content will go here */}
        <p className="text-gray-500">No tasks yet</p>
      </div>
    </div>
  );
}
