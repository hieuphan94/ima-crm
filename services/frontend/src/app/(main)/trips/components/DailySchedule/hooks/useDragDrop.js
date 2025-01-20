'use client';
import { useContext } from 'react';
import { DragDropContext } from '../contexts/DragDropContext';

export function useDragDrop() {
  const context = useContext(DragDropContext);

  if (!context) {
    throw new Error('useDragDrop must be used within DragDropProvider');
  }

  return {
    // States
    draggedItem: context.draggedItem,
    dragSource: context.dragSource,

    // Actions
    handleDragStart: context.handleDragStart,
    handleDragOver: context.handleDragOver,
    handleDragLeave: context.handleDragLeave,
    handleDrop: context.handleDrop,
  };
}
