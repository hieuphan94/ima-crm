'use client';

import { Bell, ChevronLeft, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SETTINGS_SECTIONS = {
  account: {
    title: 'Account Settings',
    icon: User,
    items: [
      { title: 'Profile Information', description: 'Update your personal details and information' },
      { title: 'Email & Password', description: 'Manage your email and password settings' },
      { title: 'Two-Factor Authentication', description: 'Add extra security to your account' },
    ],
  },
  notifications: {
    title: 'Notifications',
    icon: Bell,
    items: [
      { title: 'Email Notifications', description: 'Choose what updates you want to receive' },
      { title: 'Push Notifications', description: 'Configure your mobile notifications' },
      { title: 'Activity Alerts', description: 'Get notified about important activities' },
    ],
  },
  privacy: {
    title: 'Privacy & Security',
    icon: Lock,
    items: [
      { title: 'Privacy Settings', description: 'Control your privacy preferences' },
      { title: 'Security Log', description: 'View your account security history' },
      { title: 'Connected Devices', description: 'Manage devices connected to your account' },
    ],
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('account');

  const renderSettingItem = (item) => (
    <button
      key={item.title}
      className="w-full p-4 rounded-lg bg-white hover:bg-gray-50 
                 transition-colors duration-200 text-left group"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>
    </button>
  );

  const renderSection = (key, section) => (
    <div key={key} className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <section.icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">{section.title}</h2>
      </div>
      <div className="space-y-2">{section.items.map(renderSettingItem)}</div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => router.back()}
          className="hover:text-primary flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <span>/</span>
        <span>Settings</span>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {Object.entries(SETTINGS_SECTIONS).map(([key, section]) => renderSection(key, section))}
      </div>
    </div>
  );
}
