import axiosInstance from '../axios';

export const toursApi = {
  getAllTours: async (params) => {
    const response = await axiosInstance.get('/tours', { params });
    return response.data;
  },
  
  getTourById: async (id) => {
    const response = await axiosInstance.get(`/tours/${id}`);
    return response.data;
  },
  
  createTour: async (data) => {
    const response = await axiosInstance.post('/tours', data);
    return response.data;
  },
  
  updateTour: async (id, data) => {
    const response = await axiosInstance.put(`/tours/${id}`, data);
    return response.data;
  },
  
  deleteTour: async (id) => {
    const response = await axiosInstance.delete(`/tours/${id}`);
    return response.data;
  },
}; 