export default function ServiceTooltip({ service, visible, position }) {
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
          <span className="text-base">{service.icon || '🏛️'}</span>
          <span className="font-medium text-[11px]">{service.name}</span>
        </div>

        <div className="space-y-1">
          {/* Giá cả */}
          <div className="space-y-0.5">
            <p className="text-[9px] text-gray-500">Giá dịch vụ:</p>
            <div className="grid grid-cols-2 gap-1 text-[9px]">
              <div className="text-gray-600">Giá niêm yết:</div>
              <div className="text-gray-900">{service.quotedPrice?.toLocaleString()}đ</div>
              <div className="text-gray-600">Giá thực tế:</div>
              <div className="text-gray-900">{service.actualPrice?.toLocaleString()}đ</div>
              <div className="text-gray-600">Giá bán:</div>
              <div className="text-gray-900">{service.price?.toLocaleString()}đ</div>
            </div>
          </div>

          {/* Thời gian */}
          <div className="space-y-0.5">
            <p className="text-[9px] text-gray-500">Thời gian:</p>
            <div className="text-[9px] text-gray-900">
              Thời lượng: {service.duration || 'Chưa cập nhật'} phút
            </div>
          </div>

          {/* Thông tin vé */}
          {service.ticketInfo && Object.keys(service.ticketInfo).length > 0 && (
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-500">Thông tin vé:</p>
              <div className="space-y-0.5">
                {Object.entries(service.ticketInfo).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-1 text-[9px]">
                    <div className="text-gray-600">{key}:</div>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Giờ mở cửa */}
          {service.openingHours && Object.keys(service.openingHours).length > 0 && (
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-500">Giờ mở cửa:</p>
              <div className="space-y-0.5">
                {Object.entries(service.openingHours).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-2 gap-1 text-[9px]">
                    <div className="text-gray-600">{key}:</div>
                    <div className="text-gray-900">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Điểm nổi bật */}
          {service.highlights && service.highlights.length > 0 && (
            <div className="space-y-0.5">
              <p className="text-[9px] text-gray-500">Điểm nổi bật:</p>
              <ul className="list-disc list-inside space-y-0.5">
                {service.highlights.map((highlight, index) => (
                  <li key={index} className="text-[9px] text-gray-900">
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
