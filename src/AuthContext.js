import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for isLoggedIn

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('http://localhost:5000/api/me')
        .then(response => {
          setUser(response.data);
          setIsLoggedIn(true); // Set isLoggedIn to true when user is loaded
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
    setLoading(false);
  }, []);

  const signin = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/signin', { email, password });
      const { token, role , userId } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ email, role, userId });
      setIsLoggedIn(true); // Set isLoggedIn to true after successful signin
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const signup = async (email, password, role) => {
    try {
      await axios.post('http://localhost:5000/api/signup', { email, password, role });
      await signin(email, password);
    } catch (error) {
      alert('Failed to sign up. Please check your details and try again.');
      console.error('Error signing up', error);
    }
  };

  const signout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false); // Set isLoggedIn to false on signout
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user,setUser, signin, signup, signout, loading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
