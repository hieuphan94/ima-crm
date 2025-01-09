'use client';

import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button, CardBody, CardHeader } from '@nextui-org/react';
import { useState } from 'react';
import ChangePasswordForm from './ChangePasswordForm';
import ProfileForm from './ProfileForm';

export default function ProfileInfo() {
  const { user } = useAuth();
  const { loading } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  if (isEditing) {
    return <ProfileForm user={user} onCancel={() => setIsEditing(false)} loading={loading} />;
  }

  if (isChangingPass) {
    return (
      <ChangePasswordForm
        onCancel={() => setIsChangingPass(false)}
        loading={loading}
        failedAttempts={failedAttempts}
        onFailedAttempt={() => setFailedAttempts((prev) => prev + 1)}
        onSuccess={() => setFailedAttempts(0)}
      />
    );
  }

  return (
    <>
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <div className="w-full flex justify-between items-center">
          <h4 className="text-xl font-bold">Personal Information</h4>
          <div className="flex gap-2">
            <Button
              color="warning"
              variant="flat"
              onPress={() => setIsChangingPass(true)}
              isDisabled={loading}
            >
              Change Password
            </Button>
            <Button
              color="primary"
              variant="flat"
              onPress={() => setIsEditing(true)}
              isDisabled={loading}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="font-medium">{user?.fullName}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Username</label>
            <p className="font-medium">{user?.username}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Department</label>
            <p className="font-medium capitalize">{user?.department}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Role</label>
            <p className="font-medium capitalize">{user?.role}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500">Status</label>
            <p className="font-medium capitalize">{user?.status || 'Active'}</p>
          </div>
        </div>
      </CardBody>
    </>
  );
}
