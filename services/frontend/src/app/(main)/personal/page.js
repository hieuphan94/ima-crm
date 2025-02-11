'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardBody } from '@nextui-org/react';

export default function PersonalPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Personal Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-4">Welcome</h2>
            <div className="space-y-2">
              <p>Hello, {user?.username}!</p>
              <p className="text-sm text-gray-500">
                This is your personal space where you can manage your tasks and preferences.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">{user?.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{user?.role}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
