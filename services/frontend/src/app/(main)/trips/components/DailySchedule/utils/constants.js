export const TIME_GROUPS = [
  {
    label: 'morning',
    slots: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200',
  },
  {
    label: 'afternoon',
    slots: ['12:00', '13:00', '14:00', '15:00', '16:00'],
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  },
  {
    label: 'evening',
    slots: ['17:00', '18:00', '19:00', '20:00', '21:00'],
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
  },
];

export const SLOT_HEIGHT = 24; // px
export const SLOT_GAP = 2; // px
export const GROUP_GAP = 8; // px

export const EXCHANGE_RATE = {
  VND_TO_USD: 25500,
};
