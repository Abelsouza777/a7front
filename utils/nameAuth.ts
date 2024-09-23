import { useState, useEffect } from 'react';
import { parseCookies, destroyCookie } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';

import { setupAPIClient } from '../services/api';
export async function fetchUserData(token) {
  try {
    const apiClient = setupAPIClient();
    const response = await apiClient.get('/meauth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export function useUserData() {
  const [userData, setUserData] = useState(null);
  console.log(userData);
  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies['@nextauth.token'];

    const fetchData = async () => {
      try {
        if (token) {
          const data = await fetchUserData(token);
          setUserData(data);
        } else {
          setUserData(null);
        }
      } catch (error) {
        if (error instanceof AuthTokenError) {
          destroyCookie(null, '@nextauth.token');
          setUserData(null);
        }
      }
    };

    fetchData();

    // Limpa o estado de userData quando o componente é desmontado
    return () => setUserData(null);
  }, []);

  return userData;
}
