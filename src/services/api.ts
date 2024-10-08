import axios from 'axios';
import { supabase } from '@/utils/supabase';

const limit = 20;

let baseURL = '';

if (process.env.REACT_APP_API_URL) {
  if (process.env.REACT_APP_API_URL.startsWith('https')) {
    baseURL = `${process.env.REACT_APP_API_URL}/api`;
  } else if (process.env.REACT_APP_API_URL.startsWith('http')) {
    baseURL = process.env.REACT_APP_API_URL;
  }
} else {
  baseURL = 'http://192.168.0.68:3333/v1';
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  },
});

apiClient.interceptors.request.use(
  async (request) => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      request.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      console.warn('No access token available for API request.');
    }

    if (request.method?.toLowerCase() === 'get') {
      request.headers.limit = request.headers.limit ?? String(limit);
    }

    return request;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error message:', error.message);
    console.error('Error config:', error.config);
    console.error('Error response:', error.response);
    return Promise.reject(error);
  }
);
