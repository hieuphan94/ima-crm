import { TIME_GROUPS } from '../utils/constants';

export default function TimeSlotsSidebar() {
  return (
    <div className="w-12 pt-8">
      {TIME_GROUPS.map((group, groupIndex) => (
        <div key={group.label} className={groupIndex !== 0 ? 'mt-2' : ''}>
          {group.slots.map((time) => (
            <div
              key={time}
              className={`text-[10px] text-gray-600 h-[28px] flex items-center justify-between px-2
                ${group.bgColor} ${group.borderColor} border-r-2 font-medium bg-opacity-50
                relative group`}
            >
              {time}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
