'use client';
import { ArrowLeft, MoreVertical, Phone, Plus, Send, Video } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const tabs = [
  { id: 'information', label: 'Information' },
  { id: 'discussion', label: 'Discussion' },
  { id: 'contract', label: 'Contract & Payment' },
];

export default function RequestDetail({ params }) {
  const [activeTab, setActiveTab] = useState('information');

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-white p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/office" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-medium">Back</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-medium flex items-center gap-2">
              Myriam Giardini <span className="text-yellow-400">★</span>
            </h2>
            <span className="text-sm text-gray-500">File #3800855</span>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg mb-6">
          <Video className="w-4 h-4" />
          Generate a video call link
        </button>

        {/* Closing Confidence */}
        <div className="bg-orange-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Closing confidence</span>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              Hot
            </button>
            <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
              Warm
            </button>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Cold
            </button>
          </div>
        </div>

        {/* Associated Tags */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Associated tags (3 maximum)</span>
          </div>
          <button className="flex items-center gap-1 text-green-600">
            <Plus className="w-4 h-4" /> Associate tags
          </button>
        </div>

        {/* Request Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500">New Request</span>
            <button className="text-sm text-gray-500">Change</button>
          </div>
          <h3 className="font-medium">Contact the prospect</h3>
        </div>

        {/* Date */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500">Date</span>
            <button className="text-gray-500">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
          <span>Mon 10 February 2025</span>
        </div>

        {/* Note */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-gray-500">Note</span>
            <button className="text-gray-500">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Partner */}
        <div>
          <span className="text-gray-500">Our partner</span>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-lg">✈️</span>
            Option way
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b">
          <div className="flex items-center justify-between px-6">
            <div className="flex -mb-px">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium text-sm border-b-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <Link
              href="/trips/new"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Itinerary
            </Link>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'information' && <InformationTab />}
          {activeTab === 'discussion' && <DiscussionTab />}
          {activeTab === 'contract' && <ContractTab />}
        </div>
      </div>
    </div>
  );
}

function InformationTab() {
  return (
    <div className="max-w-3xl">
      <div className="space-y-6">
        {/* Main Information */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Main Information</h3>
            <button className="text-gray-500">Change</button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Managed by</label>
              <select className="w-full border rounded-lg p-2">
                <option>Laetitia NGUYEN</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Market</label>
              <div className="flex items-center gap-2">
                <span className="text-lg">🇫🇷</span>
                <span>FR</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Destination</label>
              <span>Vietnam</span>
            </div>
            {/* Add more fields as needed */}
          </div>
        </div>

        {/* Travelers Information */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Travelers Information</h3>
            <button className="text-gray-500">Change</button>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                Repeater ★
              </span>
            </div>
            <div className="text-gray-500">En famille</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscussionTab() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">{/* Messages will go here */}</div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Plus className="w-5 h-5" />
          </button>
          <input
            type="text"
            placeholder="Write your message"
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ContractTab() {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">Contract</h3>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Create a contract
        </button>
      </div>
      <p className="text-gray-500">There is no contract, to create one, press the button above.</p>
    </div>
  );
}
