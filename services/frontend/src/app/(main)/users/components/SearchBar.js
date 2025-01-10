import { Input } from '@nextui-org/react';
import { Search } from 'lucide-react';
import { useCallback, useState } from 'react';

export default function SearchBar({ onSearch, loading }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search để tránh gọi API quá nhiều
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 500),
    [onSearch]
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div className="w-full max-w-xs">
      <Input
        placeholder="Tìm kiếm theo tên..."
        value={searchTerm}
        onChange={handleSearch}
        startContent={<Search size={18} />}
        isDisabled={loading}
      />
    </div>
  );
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
