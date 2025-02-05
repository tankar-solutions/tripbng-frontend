import axios from "axios";

// Set the base URL for the API (adjust according to your API's base URL)
// const API_BASE_URL = "https://tripbookngo-backend.onrender.com";
const API_BASE_URL = "https://api-tripbng.onrender.com";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle request and response (optional)
apiClient.interceptors.request.use(
  (config) => {
    // You can add authorization tokens here if needed
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific response errors here
    return Promise.reject(error);
  }
);

// API Service Methods
export const apiService = {
  get: async (url, params = {}) => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      console.error("GET Error:", error);
      throw error;
    }
  },

  post: async (url, data, useFormData = false) => {
    try {
      const config = useFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const response = await apiClient.post(url, data, { ...config });
      return response.data;
    } catch (error) {
      console.error("POST Error:", error);
      throw error;
    }
  },
  post: async (url, data, useFormData = false) => {
    try {
      const config = useFormData
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      const response = await apiClient.post(url, data, { ...config });
      return response.data;
    } catch (error) {
      console.error("POST Error:", error);
      throw error;
    }
  },
  
  // put: async (url, data) => {
  //   try {
  //     const response = await apiClient.put(url, data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("PUT Error:", error);
  //     throw error;
  //   }
  // },

  patch: async (url, data) => {
    try {
      const response = await apiClient.patch(url, data);
      return response.data;
    } catch (error) {
      console.error("PATCH Error:", error);
      throw error;
    }
  },

  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      console.error("DELETE Error:", error);
      throw error;
    }
  },
};
