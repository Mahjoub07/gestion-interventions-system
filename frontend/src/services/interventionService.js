import api from './api';

const interventionService = {
  getAll: () => api.get('/interventions'),
  getById: (id) => api.get(`/interventions/${id}`),
  getByStatut: (statut) => api.get(`/interventions/statut/${statut}`),
  getByTechnicien: (technicienId) => api.get(`/interventions/technicien/${technicienId}`),
  getByUser: (userId) => api.get(`/interventions/user/${userId}`),
  create: (data) => api.post('/interventions', data),
  update: (id, data) => api.put(`/interventions/${id}`, data),
  delete: (id) => api.delete(`/interventions/${id}`)
};

export default interventionService;
