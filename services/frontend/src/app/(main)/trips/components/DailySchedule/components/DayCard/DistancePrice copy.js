'use client';

import { memo, useCallback, useState } from 'react';
import { calculatePrice } from '../../utils/calculations';

const DistancePrice = memo(function DistancePrice({ pax }) {
  const [distance, setDistance] = useState('');
  const price = calculatePrice(distance, pax);

  const handleDistanceChange = useCallback((e) => {
    const value = e.target.value;
    // Chỉ cho phép số và dấu chấm
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDistance(value);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      // Chỉ cho phép: số, backspace, delete, tab, enter, dấu chấm, arrows
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', '.', 'ArrowLeft', 'ArrowRight'];
      const isNumber = /[0-9]/.test(e.key);

      if (!isNumber && !allowedKeys.includes(e.key)) {
        e.preventDefault();
      }

      // Chỉ cho phép 1 dấu chấm
      if (e.key === '.' && distance.includes('.')) {
        e.preventDefault();
      }
    },
    [distance]
  );

  const handleBlur = useCallback((e) => {
    const value = e.target.value;
    // Format số khi blur: loại bỏ số 0 đầu và dấu chấm cuối
    if (value) {
      const formattedValue = parseFloat(value).toString();
      setDistance(formattedValue === 'NaN' ? '' : formattedValue);
    }
  }, []);

  return (
    <div className="mt-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Distance:</span>
        <div className="flex items-center gap-1">
          <input
            type="text"
            inputMode="decimal"
            value={distance}
            onChange={handleDistanceChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-16 text-right text-xs p-1 border border-gray-200 rounded focus:outline-none focus:border-blue-300 distance-input"
            placeholder="0.00"
          />
          <span className="text-xs text-gray-500">km</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Price:</span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-blue-600 price-value">{price}</span>
          <span className="text-xs text-blue-600">đ</span>
        </div>
      </div>
    </div>
  );
}, arePropsEqual);

function arePropsEqual(prevProps, nextProps) {
  return prevProps.pax === nextProps.pax;
}

export default DistancePrice;
