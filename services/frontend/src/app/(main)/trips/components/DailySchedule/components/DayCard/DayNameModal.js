'use client';

import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

// Tách component cho phần template
const DayTemplateList = ({ searchTemplate, onSelect, templates }) => {
  const filteredTemplates = useMemo(
    () =>
      templates.filter((template) =>
        template.name.toLowerCase().includes(searchTemplate.toLowerCase())
      ),
    [searchTemplate, templates]
  );

  return (
    <div className="border border-gray-200 rounded">
      <div className="max-h-40 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="p-2 hover:bg-gray-50 cursor-pointer text-sm"
            onClick={() => onSelect(template.name)}
          >
            {template.name}
          </div>
        ))}
      </div>
    </div>
  );
};

// Tách component cho phần image upload
const ImageUploader = ({ images, onUpload, onRemove }) => {
  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 3) {
        alert('Chỉ được chọn tối đa 3 hình');
        return;
      }
      onUpload(files);
    },
    [images.length, onUpload]
  );

  return (
    <div className="flex gap-2 mb-2">
      {images.map((file, index) => (
        <div key={index} className="relative w-24 h-24">
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index + 1}`}
            className="w-full h-full object-cover rounded"
          />
          <button
            onClick={() => onRemove(index)}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
          >
            ×
          </button>
        </div>
      ))}
      {images.length < 3 && (
        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-blue-400">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            multiple
          />
          <span className="text-3xl text-gray-400">+</span>
        </label>
      )}
    </div>
  );
};

function DayNameModal({ isOpen, onClose, order, dayId, onSave, onLoaded }) {
  const titleOfDay =
    useSelector((state) => state.dailySchedule.scheduleItems[dayId].titleOfDay) || '';

  const [name, setName] = useState(titleOfDay || '');
  const [images, setImages] = useState([]);
  const [searchTemplate, setSearchTemplate] = useState('');

  // Reset form khi modal đóng
  useEffect(() => {
    if (!isOpen) {
      setImages([]);
      setSearchTemplate('');
    }
  }, [isOpen]);

  const dayTemplates = useMemo(
    () => [
      { id: 1, name: 'City Tour Hà Nội' },
      { id: 2, name: 'Vịnh Hạ Long' },
      { id: 3, name: 'Sapa Trekking' },
      { id: 4, name: 'Phố Cổ Hội An' },
      { id: 5, name: 'Đà Lạt Tour' },
    ],
    []
  );

  const handleUpload = useCallback((files) => {
    setImages((prev) => [...prev, ...files].slice(0, 3));
  }, []);

  const handleRemoveImage = useCallback((index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên ngày');
      return;
    }
    onSave(name.trim());
    onClose();
  }, [name, onSave, onClose]);

  // useEffect(() => {
  //   if (titleOfDay) {
  //     setName(titleOfDay);
  //   }
  // }, [titleOfDay]);

  // Thêm useEffect để thông báo khi modal đã tải xong
  useEffect(() => {
    onLoaded?.();
  }, []); // Chỉ chạy một lần khi mount

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Overlay with blur effect */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-overlay-appear"
        onClick={onClose}
      />

      {/* Modal with animation */}
      <div
        className="
          relative bg-white rounded-lg shadow-2xl w-[500px] max-h-[80vh] overflow-y-auto
          animate-modal-appear
          transform transition-all
          z-[10000]
        "
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-xl text-gray-900">Ngày {order}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl transition-colors duration-200"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên ngày (vd: Hà Nội)"
              className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:border-blue-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh (tối đa 3)
            </label>
            <ImageUploader images={images} onUpload={handleUpload} onRemove={handleRemoveImage} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mẫu ngày có sẵn</label>
            <input
              type="text"
              value={searchTemplate}
              onChange={(e) => setSearchTemplate(e.target.value)}
              placeholder="Tìm kiếm mẫu..."
              className="w-full p-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-300 mb-2"
            />
            <DayTemplateList
              searchTemplate={searchTemplate}
              onSelect={setName}
              templates={dayTemplates}
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

DayNameModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  day: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  onLoaded: PropTypes.func,
};

export default DayNameModal;
