import { buttonStates, regionColors } from '../constants/styles';

export default function LocationButton({ location, selected, loading, onClick }) {
  // Xác định màu dựa trên region
  const regionStyle = regionColors[location.region] || {
    bg: 'bg-gray-50',
    hover: 'hover:bg-gray-100',
    border: 'border-gray-200',
  };

  return (
    <button
      onClick={() => onClick(location.name)}
      className={`text-[9px] p-0.5 rounded transition-colors whitespace-nowrap truncate
        ${selected ? buttonStates.selected.base : `${regionStyle.bg} ${regionStyle.hover} text-gray-600 border ${regionStyle.border}`}
        ${loading ? buttonStates.loading.opacity : ''}`}
      disabled={loading}
    >
      {location.name}
      {loading && <span className="ml-1 inline-block animate-spin">⌛</span>}
    </button>
  );
}
