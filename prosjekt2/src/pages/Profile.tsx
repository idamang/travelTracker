import ProfileCard from '@/components/ProfileCard';
import StatusCard from '@/components/StatusCard';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UseUser';
import { GET_USER_PROFILE } from '@/service/queries';
import { useQuery } from '@apollo/client';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login', { replace: true });
  };

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;

  const user = data.getCurrentUser;

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary text-center">
        My Profile
      </h1>
      <ProfileCard user={user} />
      <StatusCard user={user} />

      {/* Log Out Button */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={handleLogout}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
