import axios from 'axios'

// Create a centralized Axios instance configured with your base URL.
// By importing this `api` object in your components, you won't need to 
// type the full URL every time you make a request.
export const api = axios.create({
  baseURL: 'http://localhost:3000/auth/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This tells Axios to send cookies along with every request
})

// Optional: Set up interceptors to automatically attach your authentication token 
// to every request in the future!
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});
