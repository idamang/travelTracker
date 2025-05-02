import React, { createContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { CHECK_AUTH } from '@/service/queries'; // Import your query here
import { User } from '@/service/types';

interface UserContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
  loading: true,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useQuery(CHECK_AUTH, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.getCurrentUser) {
        setUser(data.getCurrentUser);
      }
      setLoading(false);
    },
    onError: () => {
      setUser(null);
      setLoading(false); // Set loading to false even if the query fails
    },
  });

  useEffect(() => {
    // If no token exists, stop loading immediately
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
