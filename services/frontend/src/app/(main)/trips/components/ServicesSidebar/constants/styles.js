import { MealType } from '@/data/models/enums';

export const mealTypeColors = {
  [MealType.BREAKFAST]: {
    header: 'text-amber-600 bg-amber-50',
    item: 'hover:bg-amber-50 border-amber-100',
  },
  [MealType.LUNCH]: {
    header: 'text-emerald-600 bg-emerald-50',
    item: 'hover:bg-emerald-50 border-emerald-100',
  },
  [MealType.DINNER]: {
    header: 'text-indigo-600 bg-indigo-50',
    item: 'hover:bg-indigo-50 border-indigo-100',
  },
};

// Màu sắc cho các section header
export const sectionColors = {
  visit: {
    bg: 'bg-emerald-50',
    hover: 'hover:bg-emerald-100',
    text: 'text-emerald-700',
  },
  food: {
    bg: 'bg-orange-50',
    hover: 'hover:bg-orange-100',
    text: 'text-orange-700',
  },
  guide: {
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-100',
    text: 'text-purple-700',
  },
};

// Màu sắc cho các region
export const regionColors = {
  north: {
    bg: 'bg-red-50',
    hover: 'hover:bg-red-100',
    border: 'border-red-200',
  },
  central: {
    bg: 'bg-yellow-50',
    hover: 'hover:bg-yellow-100',
    border: 'border-yellow-200',
  },
  south: {
    bg: 'bg-green-50',
    hover: 'hover:bg-green-100',
    border: 'border-green-200',
  },
};

// Styles cho các button states
export const buttonStates = {
  selected: {
    base: 'bg-emerald-100 border-emerald-200',
  },
  loading: {
    opacity: 'opacity-50',
  },
  default: {
    base: 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200',
  },
};

// Styles cho search và filter components
export const inputStyles = {
  search:
    'w-full text-[9px] p-1 pr-6 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500',
  select:
    'flex-1 text-[9px] p-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500',
};

// Styles cho service items
export const serviceItemStyles = {
  container:
    'flex items-center justify-between p-1 rounded hover:bg-gray-50 cursor-move border border-gray-100',
  text: {
    icon: 'text-[11px]',
    name: 'text-[9px]',
    price: 'text-[9px] text-gray-500',
  },
};
