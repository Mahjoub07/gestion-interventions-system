export const STATUT = {
  EN_ATTENTE: 'EN_ATTENTE',
  EN_COURS: 'EN_COURS',
  TERMINE: 'TERMINE',
  ANNULE: 'ANNULE',
  EN_PAUSE: 'EN_PAUSE'
};

export const STATUT_LABELS = {
  EN_ATTENTE: 'En attente',
  EN_COURS: 'En cours',
  TERMINE: 'Terminée',
  ANNULE: 'Annulée',
  EN_PAUSE: 'En pause'
};

export const STATUT_COLORS = {
  EN_ATTENTE: 'warning',
  EN_COURS: 'info',
  TERMINE: 'success',
  ANNULE: 'danger',
  EN_PAUSE: 'primary'
};

export const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  USER: 'Enseignant',
  TECHNICIAN: 'Technicien'
};

export const ROLE_COLORS = {
  ADMIN: 'warning',
  USER: 'info',
  TECHNICIAN: 'success'
};

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8090/api';
export const PAGINATION_OPTIONS = [10, 20, 50];
