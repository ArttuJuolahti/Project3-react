import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// function that allows any component to easily talk to the backend
export function useApi(endpoint, token) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // helper: add auth header only if token exists
  const getHeaders = () => {
    if (!token) return {};
    return {
      headers: { 'x-auth-token': token },
    };
  };

  // READ
  const refresh = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}${endpoint}`, getHeaders());
      setData(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [endpoint, token]);

  // CREATE
  const create = async (newItem) => {
    try {
      const res = await axios.post(
        `${API_URL}${endpoint}`,
        newItem,
        getHeaders()
      );
      setData((prev) => [...prev, res.data]);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // DELETE
  const remove = async (id) => {
    try {
      await axios.delete(`${API_URL}${endpoint}/${id}`, getHeaders());
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return { data, loading, error, refresh, create, remove };
}
