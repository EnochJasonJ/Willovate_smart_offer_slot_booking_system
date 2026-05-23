import api from './api';

export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const userData = {
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      const userData = {
        name: response.data.name,
        email: response.data.email,
        role: response.data.role
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Error parsing user data", e);
      localStorage.removeItem('user');
      return null;
    }
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  getRoleFromToken: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // ASP.NET Core Role Claim URI
      return payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || payload.role || null;
    } catch (e) {
      return null;
    }
  }
};
