import { useDispatch } from 'react-redux';
import { setUserCredentials } from '../redux/userSlice'; 
import { LoginCredentials } from '../services/authService'; 
import authService from '../services/authService'; 
import { useState } from 'react';

interface AuthHook {
  login: (data: LoginCredentials) => Promise<boolean>; // login returns a Promise<boolean>
  loading: boolean;
  error: string | null;
}

export const useAuth = (): AuthHook => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async ({ email, password }: LoginCredentials): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login({ email, password }); // Use authService to login
      const { accessToken, refreshToken, userId } = response.data; // Adjust this according to your API response structure

      // Dispatch the credentials to Redux
      dispatch(setUserCredentials({ accessToken, refreshToken, userId }));

      setLoading(false);
      return true; // Return true on successful login
    } catch (err) {
      setLoading(false);
      setError('Login failed. Please check your credentials.');
      return false; // Return false on failure
    }
  };

  return { login, loading, error }; // Explicitly return login, loading, and error
};
