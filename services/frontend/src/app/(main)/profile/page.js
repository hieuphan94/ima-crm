'use client';

import { Card } from '@nextui-org/react';
import ProfileInfo from './components/ProfileInfo';

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      <Card className="max-w-3xl mx-auto">
        <ProfileInfo />
      </Card>
    </div>
  );
}
