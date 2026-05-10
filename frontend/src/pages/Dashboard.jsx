import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import Table from '../components/common/Table';
import { InterventionStatusBadge } from '../components/common/StatusBadge';
import interventionService from '../services/interventionService';
import { STATUT_LABELS } from '../utils/constants';
import { formatDate, truncate } from '../utils/helpers';
import './Dashboard.css';

const StatCard = ({ title, value, icon, color, onClick }) => (
  <div className={`stat-card stat-card--${color}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__content">
      <span className="stat-card__value">{value}</span>
      <span className="stat-card__title">{title}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        let response;
        if (hasRole('TECHNICIAN')) {
          response = await interventionService.getByTechnicienEmail(user.email);
        } else if (hasRole('USER')) {
          response = await interventionService.getByUser(user.id);
        } else {
          response = await interventionService.getAll();
        }
        if (isMounted) setInterventions(response.data || []);
      } catch (err) {
        if (isMounted) {
          setError('Erreur lors du chargement des données');
          showToast('Erreur de chargement des données', 'error');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [hasRole, showToast, user?.email, user?.id]);

  const stats = {
    total: interventions.length,
    enAttente: interventions.filter(i => i.statut === 'EN_ATTENTE').length,
    enCours: interventions.filter(i => i.statut === 'EN_COURS').length,
    terminees: interventions.filter(i => i.statut === 'TERMINE').length,
  };

  const recentInterventions = [...interventions]
    .sort((a, b) => new Date(b.dateIntervention || 0) - new Date(a.dateIntervention || 0))
    .slice(0, 5);

  const columns = [
    { key: 'titre', title: 'Titre' },
    { key: 'description', title: 'Description', render: (row) => truncate(row.description, 40) },
    { key: 'dateIntervention', title: 'Date', render: (row) => formatDate(row.dateIntervention) },
    { key: 'statut', title: 'Statut', render: (row) => <InterventionStatusBadge status={row.statut} /> },
    { key: 'technicien', title: 'Technicien', render: (row) => row.technicien ? `${row.technicien.prenom} ${row.technicien.nom}` : '-' },
  ];

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Tableau de bord</h1>
          <p className="dashboard__subtitle">Bienvenue, {user?.prenom} {user?.nom}</p>
        </div>
        {!hasRole('TECHNICIAN') && (
          <Button variant="primary" onClick={() => navigate('/interventions')}>
            + Nouvelle Intervention
          </Button>
        )}
      </div>

      <div className="dashboard__stats">
        <StatCard title="Total Interventions" value={stats.total} icon="📋" color="primary" />
        <StatCard title={STATUT_LABELS.EN_ATTENTE} value={stats.enAttente} icon="⏳" color="warning" onClick={() => navigate('/interventions')} />
        <StatCard title={STATUT_LABELS.EN_COURS} value={stats.enCours} icon="🔧" color="info" onClick={() => navigate('/interventions')} />
        <StatCard title={STATUT_LABELS.TERMINE} value={stats.terminees} icon="✅" color="success" onClick={() => navigate('/interventions')} />
      </div>

      <div className="dashboard__actions">
        <Button variant="secondary" size="sm" onClick={() => navigate('/interventions')}>🔧 Gérer les interventions</Button>
        {hasRole('ADMIN') && (
          <Button variant="secondary" size="sm" onClick={() => navigate('/technicians')}>👷 Gérer les techniciens</Button>
        )}
      </div>

      <Card title="Interventions récentes" subtitle="Les 5 dernières interventions">
        {error ? (
          <div className="dashboard__error">{error}</div>
        ) : recentInterventions.length === 0 ? (
          <EmptyState title="Aucune intervention" message="Créez votre première intervention pour commencer." />
        ) : (
          <Table columns={columns} data={recentInterventions} keyExtractor={(row) => row.id} />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
