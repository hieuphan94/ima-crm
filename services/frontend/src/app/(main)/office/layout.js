export default function OfficeLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full mx-auto px-1 py-1">{children}</div>
    </div>
  );
}
