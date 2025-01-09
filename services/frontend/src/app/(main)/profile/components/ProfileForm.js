'use client';

import { useProfile } from '@/hooks/useProfile';
import { Button, CardBody, CardHeader, Input } from '@nextui-org/react';
import { useState } from 'react';

export default function ProfileForm({ user, onCancel }) {
  const { updateProfile, loading } = useProfile();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    username: user?.username || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        fullName: formData.fullName.trim(),
        username: formData.username.trim(),
      };

      await updateProfile(updateData);
      onCancel();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <>
      <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
        <div className="w-full flex justify-between items-center">
          <h4 className="text-xl font-bold">Edit Profile</h4>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button color="danger" variant="flat" onPress={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button color="primary" type="submit" isLoading={loading}>
              Save Changes
            </Button>
          </div>
        </form>
      </CardBody>
    </>
  );
}
