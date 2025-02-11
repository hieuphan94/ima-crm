import Link from 'next/link';

export default function Inbox() {
  const newRequests = [
    {
      id: '3800855',
      name: 'Myriam Giardini',
      rating: 5,
      travelDate: 'Oct 2025',
      timeAgo: '13 h',
      isVIP: true,
    },
    {
      name: 'sarah guilland',
      rating: 1,
      travelDate: 'Aug 2025',
      timeAgo: '5 h',
      isVIP: false,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">New Requests ({newRequests.length})</h2>
      <div className="bg-white rounded-lg shadow">
        {newRequests.map((request, index) => (
          <Link
            key={request.id}
            href={`/office/${request.id}`}
            className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
              index !== newRequests.length - 1 ? 'border-b' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{request.name}</span>
                  {request.isVIP && <span className="text-yellow-400">★</span>}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < request.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ●
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">{request.travelDate}</span>
              <span className="text-sm text-gray-400">{request.timeAgo}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
