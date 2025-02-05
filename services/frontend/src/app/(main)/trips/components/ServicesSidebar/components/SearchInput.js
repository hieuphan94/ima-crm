import { IoIosSearch } from 'react-icons/io';
import { inputStyles } from '../constants/styles';

export default function SearchInput({ value, onChange, placeholder, className }) {
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${inputStyles.search} ${className}`}
      />
      <IoIosSearch className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
    </div>
  );
}
