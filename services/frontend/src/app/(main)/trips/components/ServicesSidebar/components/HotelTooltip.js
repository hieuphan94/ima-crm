export default function HotelTooltip({ service, visible, position }) {
  if (!visible) return null;

  return (
    <div
      className="absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[200px]"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
      }}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{service.icon || '🏨'}</span>
          <span className="font-medium text-[11px]">{service.name}</span>
        </div>

        <div className="space-y-1">
          {/* Giá cả */}
          <div className="space-y-0.5">
            <div className="grid grid-cols-2 gap-1 text-[9px]">
              <div className="text-gray-600">Star:</div>
              <div className="text-gray-900">{service.rating}</div>
              <div className="text-gray-600">Type:</div>
              <div className="text-gray-900">{service.accommodationType}</div>
              <div className="text-gray-600">Giá FIT:</div>
              <div className="text-gray-900">
                {service.rooms.price.fit_price?.toLocaleString()}đ
              </div>
              <div className="text-gray-600">Giá GIT:</div>
              <div className="text-gray-900">
                {service.rooms.price.git_price?.toLocaleString()}đ
              </div>
              <div className="text-gray-600">Giá FOC:</div>
              <div className="text-gray-900">
                {service.rooms.price.foc_price?.toLocaleString()}đ
              </div>
              <div className="text-gray-600">Giá SUP:</div>
              <div className="text-gray-900">
                {service.rooms.price.sup_price?.toLocaleString()}đ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
