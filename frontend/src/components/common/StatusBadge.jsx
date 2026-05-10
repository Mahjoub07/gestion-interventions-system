import React from 'react';
import Badge from './Badge';
import { STATUT_LABELS, STATUT_COLORS, ROLE_LABELS, ROLE_COLORS } from '../../utils/constants';

export const InterventionStatusBadge = ({ status }) => {
  const label = STATUT_LABELS[status] || status;
  const color = STATUT_COLORS[status] || 'default';
  return <Badge variant={color}>{label}</Badge>;
};

export const RoleBadge = ({ role }) => {
  const label = ROLE_LABELS[role] || role;
  const color = ROLE_COLORS[role] || 'default';
  return <Badge variant={color}>{label}</Badge>;
};
