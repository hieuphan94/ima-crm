export default function PhotoUpload({ onUpload }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span>Photos:</span>
        <a href="#" className="text-green-600 hover:underline text-sm">
          How to choose the right photos?
        </a>
      </div>
      <div className="border-2 border-dashed rounded-lg h-[60px] flex items-center justify-center">
        <div className="text-center flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" {...props} />
          </div>
          <p className="text-gray-500 text-sm">Click or drag photos here</p>
        </div>
      </div>
    </div>
  );
}
