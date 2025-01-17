import { useScheduleState } from '../states/useScheduleState';

export default function GlobalPaxInput({ className, placeholder, onChange }) {
  const { globalPax, updateGlobalPax } = useScheduleState();

  const handleChange = (e) => {
    onChange?.(e, updateGlobalPax);
  };

  return (
    <input
      type="text"
      className={className}
      placeholder={placeholder}
      value={globalPax}
      onChange={handleChange}
    />
  );
}
