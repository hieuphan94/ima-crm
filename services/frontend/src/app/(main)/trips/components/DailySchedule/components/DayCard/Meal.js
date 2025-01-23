'use client';

import { toggleMealIncluded, toggleMealOption } from '@/store/slices/useDailyScheduleSlice';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const MEAL_OPTIONS = [
  { id: 'breakfast', label: 'breakfast' },
  { id: 'lunch', label: 'lunch' },
  { id: 'dinner', label: 'dinner' },
];

const Meal = memo(function Meal({ dayId }) {
  const dispatch = useDispatch();
  const dayMeals = useSelector(
    (state) =>
      state.dailySchedule.scheduleItems[dayId]?.meals || {
        included: true,
        breakfast: true,
        lunch: false,
        dinner: false,
      }
  );

  const handleMealIncludedChange = (included) => {
    dispatch(toggleMealIncluded({ dayId, included }));
  };

  const handleMealOptionChange = (mealType) => {
    dispatch(toggleMealOption({ dayId, mealType }));
  };

  return (
    <div className="bg-gray-100 rounded py-2 my-1 px-1">
      <div className="space-y-1">
        {/* Meals Included Radio */}
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            name={`meal-type-${dayId}`}
            checked={dayMeals.included}
            onChange={() => handleMealIncludedChange(true)}
            className="w-2.5 h-2.5 text-primary border-gray-300 focus:ring-primary"
          />
          <span className="text-[9px]">Meals included</span>
        </label>

        {/* Meal Options */}
        <div className={`flex gap-2 ${!dayMeals.included ? 'opacity-50 pointer-events-none' : ''}`}>
          {MEAL_OPTIONS.map((option) => (
            <label key={option.id} className="flex items-center gap-0.5">
              <input
                type="checkbox"
                checked={dayMeals[option.id]}
                onChange={() => handleMealOptionChange(option.id)}
                disabled={!dayMeals.included}
                className="w-2 h-2 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-[8px] capitalize">{option.label}</span>
            </label>
          ))}
        </div>

        {/* No Meals Radio */}
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            name={`meal-type-${dayId}`}
            checked={!dayMeals.included}
            onChange={() => handleMealIncludedChange(false)}
            className="w-2.5 h-2.5 text-primary border-gray-300 focus:ring-primary"
          />
          <span className="text-[9px]">No meals</span>
        </label>
      </div>
    </div>
  );
});

export default Meal;
