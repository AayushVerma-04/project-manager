import React, { useState } from 'react'
import useAuthContext from './useAuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const baseURL = import.meta.env.VITE_API_BASE_URL;

const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const nav = useNavigate();

    const login = async (email, password) => {
        //console.log(`${baseURL}/api/user/login`);

        try {
            setIsLoading(true);
            setError(null);

            const result = await axios.post(
                `${baseURL}/api/user/login`,
                { email, password }
            );

            localStorage.setItem("user", JSON.stringify(result.data));
            dispatch({ type: 'LOGIN', payload: result.data });

            setIsLoading(false);
            nav('/home');
        } catch (error) {
            setIsLoading(false);
            setError(error.response?.data?.message || 'Login failed');
        }
    }

    return { login, isLoading, error };
}

export default useLogin;
