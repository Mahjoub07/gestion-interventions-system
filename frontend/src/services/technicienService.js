import api from './api';

const technicienService = {
  getAll: () => api.get('/techniciens'),
  getById: (id) => api.get(`/techniciens/${id}`),
  create: (data) => api.post('/techniciens', data),
  update: (id, data) => api.put(`/techniciens/${id}`, data),
  delete: (id) => api.delete(`/techniciens/${id}`)
};

export default technicienService;
