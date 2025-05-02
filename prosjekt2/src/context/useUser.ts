import { useContext } from 'react';
import { UserContext } from './UserContext'; // Adjust path as needed

export const useUser = () => useContext(UserContext);
