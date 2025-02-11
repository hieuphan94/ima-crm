'use client';
import { CheckSquare, GitBranch, Inbox as InboxIcon } from 'lucide-react';
import { useState } from 'react';
import Inbox from './components/Inbox';
import Pipeline from './components/Pipeline';
import Todo from './components/Todo';

const tabs = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: InboxIcon,
    count: 2,
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    icon: GitBranch,
  },
  {
    id: 'todo',
    label: 'To Do',
    icon: CheckSquare,
  },
];

export default function OfficePage() {
  const [activeTab, setActiveTab] = useState('inbox');

  const renderContent = () => {
    switch (activeTab) {
      case 'inbox':
        return <Inbox />;
      case 'pipeline':
        return <Pipeline />;
      case 'todo':
        return <Todo />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.count && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4"></div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Agency capacity</button>
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900">Filters</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-6">{renderContent()}</div>
    </div>
  );
}
