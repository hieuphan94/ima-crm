'use client';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';

const initialStages = {
  'new-request': {
    id: 'new-request',
    title: 'New Request',
    items: [
      {
        id: '1',
        action: 'Contact the prospect',
        name: 'Florence Laverny',
        country: 'Vietnam',
        date: '01 May 2024',
        duration: '19 days',
        pax: 2,
        dueDate: '12 Sept',
      },
    ],
  },
  discovery: {
    id: 'discovery',
    title: 'Discovery',
    items: [
      {
        id: '2',
        action: 'Call scheduled',
        name: 'Marie Dupont',
        country: 'Vietnam',
        date: '15 May 2024',
        duration: '14 days',
        pax: 4,
        dueDate: '20 Sept',
      },
    ],
  },
  'first-itinerary': {
    id: 'first-itinerary',
    title: 'First Itinerary Creation',
    items: [
      {
        id: '3',
        action: 'Send the itinerary',
        name: 'Jean Martin',
        country: 'Vietnam',
        date: '15 Dec 2022',
        duration: '32 days',
        pax: 1,
        price: '€1,500',
        dueDate: '24 Jul',
      },
    ],
  },
  'fine-tuning': {
    id: 'fine-tuning',
    title: 'Fine Tuning',
    items: [],
  },
  validated: {
    id: 'validated',
    title: 'Itinerary Validated',
    items: [],
  },
};

export default function Pipeline() {
  const [stages, setStages] = useState(initialStages);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Moving within the same stage
    if (source.droppableId === destination.droppableId) {
      const stageItems = Array.from(stages[source.droppableId].items);
      const [removed] = stageItems.splice(source.index, 1);
      stageItems.splice(destination.index, 0, removed);

      setStages({
        ...stages,
        [source.droppableId]: {
          ...stages[source.droppableId],
          items: stageItems,
        },
      });
    } else {
      // Moving to different stage
      const sourceItems = Array.from(stages[source.droppableId].items);
      const destItems = Array.from(stages[destination.droppableId].items);
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setStages({
        ...stages,
        [source.droppableId]: {
          ...stages[source.droppableId],
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...stages[destination.droppableId],
          items: destItems,
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-5 gap-4">
        {Object.values(stages).map((stage) => (
          <div key={stage.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                {stage.title} ({stage.items.length})
              </h3>
            </div>
            <Droppable droppableId={stage.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-3 min-h-[200px] ${
                    snapshot.isDraggingOver ? 'bg-gray-100' : ''
                  }`}
                >
                  {stage.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white p-4 rounded-lg shadow-sm ${
                            snapshot.isDragging ? 'shadow-md' : ''
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium">{item.action}</span>
                            <span className="text-sm text-gray-500">{item.dueDate}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {item.country} • {item.date} • {item.duration}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.pax} PAX {item.price && `• ${item.price}`}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
