'use client';
import { CheckCircle, Circle } from 'lucide-react';
import { useState } from 'react';

const taskList = [
  {
    id: 1,
    task: 'Book Hotels, Cruise & Train',
    deadline: 'within 7 days from booking date',
    isCompleted: false,
    section: 'booking',
    tab: 'hotel',
  },
  {
    id: 2,
    task: 'Book Special Services',
    deadline: 'within 7 days from booking date',
    isCompleted: false,
    section: 'booking',
    tab: 'special',
  },
  {
    id: 3,
    task: 'Book Guide',
    deadline: 'within 7 days from booking date',
    isCompleted: false,
    section: 'booking',
    tab: 'guide',
  },
  {
    id: 4,
    task: 'Send Flight Booking Email',
    deadline: '60-45 days before tour',
    isCompleted: false,
    section: 'export-ticket',
    tab: 'flight-info',
  },
  {
    id: 5,
    task: 'Monitor and Confirm Ticket Issuance',
    deadline: '60-45 days before tour',
    isCompleted: false,
    section: 'export-ticket',
    tab: 'documents',
  },
  {
    id: 6,
    task: 'Input Tour Program',
    deadline: '45 days before tour',
    isCompleted: false,
    section: 'update-trip',
    tab: 'program',
  },
  {
    id: 7,
    task: 'Book Transportation',
    deadline: '45-30 days before tour',
    isCompleted: false,
    section: 'booking',
    tab: 'transport',
  },
  {
    id: 8,
    task: 'Hotel Payment Notice',
    deadline: '20 days before tour',
    isCompleted: false,
    section: 'payment',
    tab: 'hotel',
  },
  {
    id: 9,
    task: 'Process Hotel Payment',
    deadline: '20 days before tour',
    isCompleted: false,
    section: 'payment',
    tab: 'hotel',
  },
  {
    id: 10,
    task: 'Finalize Tour Program',
    deadline: '15 days before tour',
    isCompleted: false,
    section: 'update-trip',
    tab: 'program',
  },
  {
    id: 11,
    task: 'Check Flight Tickets & Visas',
    deadline: '15 days before tour',
    isCompleted: false,
    section: 'checking',
    tab: 'documents',
  },
  {
    id: 12,
    task: 'Book Restaurants',
    deadline: '15 days before tour',
    isCompleted: false,
    section: 'booking',
    tab: 'restaurant',
  },
  {
    id: 13,
    task: 'Book Attractions',
    deadline: '15 days before tour',
    isCompleted: false,
    section: 'booking',
    tab: 'attraction',
  },
  {
    id: 14,
    task: 'Print Documents',
    deadline: '15 days before tour',
    isCompleted: false,
    section: 'document',
    tab: 'print',
  },
  {
    id: 15,
    task: 'Send Documents to Guide',
    deadline: '10 days before tour',
    isCompleted: false,
    section: 'document',
    tab: 'guide',
  },
  {
    id: 16,
    task: 'Send Documents to Transport',
    deadline: '10 days before tour',
    isCompleted: false,
    section: 'document',
    tab: 'transport',
  },
  {
    id: 17,
    task: 'Send Rooming List to Hotels',
    deadline: '10 days before tour',
    isCompleted: false,
    section: 'document',
    tab: 'hotel',
  },
  {
    id: 18,
    task: 'Book Picnic Breakfast & Shuttle',
    deadline: '10 days before tour',
    isCompleted: false,
    section: 'booking',
    tab: 'special',
  },
  {
    id: 19,
    task: 'Input Revenue & Cost',
    deadline: '7 days before tour',
    isCompleted: false,
    section: 'update-trip',
    tab: 'finance',
  },
];

const TaskTimeline = ({ onTaskClick }) => {
  const [tasks, setTasks] = useState(taskList);

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task))
    );
  };

  const handleTaskClick = (task) => {
    // Gọi callback để thay đổi section và tab trong OperatorView
    onTaskClick(task.section, task.tab);
  };

  return (
    <div className="w-60 bg-white p-4 mt-1 border-gray-200 h-screen overflow-y-auto rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Timeline Task</h2>
      <div className="space-y-1">
        {tasks.map((task, index) => (
          <div key={task.id} className="relative">
            {/* Vertical line */}
            {index < tasks.length - 1 && (
              <div className="absolute left-[9px] top-[28px] w-[2px] h-[calc(100%+16px)] bg-gray-200" />
            )}

            <div className="flex items-start gap-3">
              <button onClick={() => toggleTask(task.id)} className="relative z-10 mt-1">
                {task.isCompleted ? (
                  <CheckCircle className="w-[20px] h-[20px] text-green-500" />
                ) : (
                  <Circle className="w-[20px] h-[20px] text-gray-300" />
                )}
              </button>

              <div
                className="flex-1 cursor-pointer hover:bg-gray-50 p-1 rounded"
                onClick={() => handleTaskClick(task)}
              >
                <div
                  className={`font-small text-[11px] ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}
                >
                  {task.task}
                </div>
                <div className="text-[9px] text-gray-500 mt-1">{task.deadline}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTimeline;
