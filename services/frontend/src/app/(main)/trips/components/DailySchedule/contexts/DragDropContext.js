'use client';
import { createContext } from 'react';

const defaultDragDropContext = {
  // States
  draggedItem: null,
  dragSource: null, // { day, time, index } - để track vị trí gốc khi di chuyển

  // Actions
  handleDragStart: (e, service, sourceInfo) => {},
  handleDragOver: (e) => {},
  handleDragLeave: (e) => {},
  handleDrop: (day, time, e) => {},
};

export const DragDropContext = createContext(defaultDragDropContext);
export { defaultDragDropContext };
