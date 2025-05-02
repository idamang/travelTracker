import React, { useState } from 'react';
import { Edit, Home, Mail, Save, User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/service/mutations';
import { GET_USER_PROFILE } from '@/service/queries';
import { Input } from './ui/input';

type Country = {
  id: number;
  country_name: string;
};

interface ProfileCardProps {
  user: {
    id: number;
    name: string;
    email: string;
    address: string;
    country: Country;
  };
}

export function ProfileCard({ user }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    address: user.address,
    countryId: user.country?.id || null,
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onError: (error) => {
      console.error('Error updating user:', error);
    },
    onCompleted: () => {
      setIsEditing(false);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    updateUser({
      variables: {
        id: user.id,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        countryId: formData.countryId,
      },
      refetchQueries: [{ query: GET_USER_PROFILE }],
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name,
      email: user.email,
      address: user.address,
      countryId: user.country?.id || null,
    });
  };

  return (
    <Card className="max-w-2xl my-4 w-full bg-card text-card-foreground shadow-lg rounded-lg">
      <CardContent className="p-6 flex flex-col items-center">
        <figure className="w-24 h-24 rounded-full bg-tertiary flex items-center justify-center gap-y-4 mb-6">
          <User className="w-12 h-12 text-tertiary-foreground" />
        </figure>

        {isEditing ? (
          <form
            className="grid grid-cols-1 gap-y-4"
            aria-live="polite"
            aria-label="Edit Profile"
          >
            <fieldset>
              <legend className="sr-only">Edit Profile</legend>

              <label>
                <span className="block text-sm font-medium text-primary">
                  Name
                </span>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                />
              </label>

              <label>
                <span className="block text-sm font-medium text-primary">
                  Address
                </span>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border rounded p-2 w-full"
                />
              </label>

              <div className="flex justify-between mt-4">
                <Button onClick={handleCancel} type="button">
                  Cancel
                </Button>
                <Button onClick={handleSave} type="button" className="gap-2">
                  <Save size={20} />
                  Save
                </Button>
              </div>
            </fieldset>
          </form>
        ) : (
          <dl className="grid grid-cols-1 gap-y-4 justify-center items-center">
            <div className="flex items-center">
              <dt className="mr-3">
                <User className="w-5 h-5 text-muted-foreground" />
              </dt>
              <dd className="text-xl font-semibold text-primary">
                {user.name}
              </dd>
            </div>

            <div className="flex items-center">
              <dt className="mr-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </dt>
              <dd className="text-muted-foreground">
                {user.email || 'No email provided'}
              </dd>
            </div>

            <div className="flex items-center">
              <dt className="mr-3">
                <Home className="w-5 h-5 text-muted-foreground" />
              </dt>
              <dd className="text-muted-foreground">
                {user.address || 'No address provided'},{' '}
                {user.country?.country_name || 'No country'}
              </dd>
            </div>
          </dl>
        )}

        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} className="mt-4 gap-2">
            <Edit size={20} />
            Edit
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
