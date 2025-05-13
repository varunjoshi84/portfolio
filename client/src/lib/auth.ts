import { apiRequest } from './queryClient';

export async function loginUser(username: string, password: string) {
  try {
    const response = await apiRequest('POST', '/api/auth/login', { username, password });
    return await response.json();
  } catch (error) {
    throw new Error('Login failed');
  }
}

export async function logoutUser() {
  try {
    await apiRequest('POST', '/api/auth/logout', null);
    return true;
  } catch (error) {
    throw new Error('Logout failed');
  }
}

export async function checkAuthStatus() {
  try {
    const response = await apiRequest('GET', '/api/auth/status', null);
    return await response.json();
  } catch (error) {
    return { authenticated: false };
  }
}
