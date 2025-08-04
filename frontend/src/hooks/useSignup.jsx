import { useState } from 'react';
import useAuthContext from './useAuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const nav = useNavigate();

  const signup = async (username, email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await axios.post(`${baseURL}/api/user/signup`, {
        username,
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(result.data));
      dispatch({ type: 'LOGIN', payload: result.data });

      setIsLoading(false);
      nav('/home');
    } catch (error) {
      setIsLoading(false);
      setError(error.response.data.message);
    }
  };

  return { signup, isLoading, error };
};

export default useSignup;
