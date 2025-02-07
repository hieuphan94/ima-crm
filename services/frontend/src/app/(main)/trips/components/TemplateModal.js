import { Search, X } from 'lucide-react';
import { useState } from 'react';

const MOCK_TEMPLATES = [
  {
    id: 1,
    name: 'Hạ Long 3N2Đ Premium',
    code: 'HL3N2D-001',
    location: 'Hạ Long',
    creator: 'John Doe',
  },
  {
    id: 2,
    name: 'Sapa Adventure 4N3Đ',
    code: 'SP4N3D-002',
    location: 'Sapa',
    creator: 'Jane Smith',
  },
  {
    id: 3,
    name: 'Sapa Adventure 4N3Đ',
    code: 'SP4N3D-002',
    location: 'Sapa',
    creator: 'Jane Smith',
  },
  {
    id: 4,
    name: 'Sapa Adventure 4N3Đ',
    code: 'SP4N3D-002',
    location: 'Sapa',
    creator: 'Jane Smith',
  },
  {
    id: 5,
    name: 'Sapa Adventure 4N3Đ',
    code: 'SP4N3D-002',
    location: 'Sapa',
    creator: 'Jane Smith',
  },
  {
    id: 6,
    name: 'Sapa Adventure 4N3Đ',
    code: 'SP4N3D-002',
    location: 'Sapa',
    creator: 'Jane Smith',
  },
  {
    id: 7,
    name: 'Sapa Adventure 4N3Đ',
    code: 'SP4N3D-002',
    location: 'Sapa',
    creator: 'Jane Smith',
  },
  {
    id: 8,
    name: 'Sapa Adventure 4N3Đ',
    code: 'SP4N3D-002',
    location: 'Sapa',
    creator: 'Jane Smith',
  },
  // Add more mock data as needed
];

export default function TemplateModal({ isOpen, onClose }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTemplates = MOCK_TEMPLATES.filter((template) => {
    const searchTerms = search
      .toLowerCase()
      .split(' ')
      .filter((term) => term.length > 0);

    if (searchTerms.length === 0) return true;

    return searchTerms.some(
      (term) =>
        template.name.toLowerCase().includes(term) ||
        template.code.toLowerCase().includes(term) ||
        template.location.toLowerCase().includes(term) ||
        template.creator.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const currentTemplates = filteredTemplates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleLoadTemplate = (template) => {
    // TODO: Implement template loading logic
    console.log('Loading template:', template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Load Template Trip</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Template Name</th>
                <th className="text-left py-2">Code</th>
                <th className="text-left py-2">Location</th>
                <th className="text-left py-2">Creator</th>
                <th className="text-right py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentTemplates.map((template) => (
                <tr key={template.id} className="border-b">
                  <td className="py-3">{template.name}</td>
                  <td>{template.code}</td>
                  <td>{template.location}</td>
                  <td>{template.creator}</td>
                  <td className="text-right">
                    <button
                      onClick={() => handleLoadTemplate(template)}
                      className="px-3 py-1 text-sm rounded-lg bg-primary text-white hover:bg-primary/90"
                    >
                      Load
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg ${
                currentPage === i + 1
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
