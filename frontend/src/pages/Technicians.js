import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import SearchBar from '../components/common/SearchBar';
import Table from '../components/common/Table';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import technicienService from '../services/technicienService';
import interventionService from '../services/interventionService';
import './Interventions.css';

const INITIAL_FORM = {
  nom: '',
  prenom: '',
  email: ''
};

const Technicians = () => {
  const { hasRole } = useAuth();
  const { showToast } = useToast();
  const [technicians, setTechnicians] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [techRes, intervRes] = await Promise.all([
        technicienService.getAll(),
        interventionService.getAll()
      ]);
      setTechnicians(techRes.data || []);
      setInterventions(intervRes.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur de chargement des données';
      setError(typeof msg === 'string' ? msg : 'Erreur de chargement des données');
      showToast(typeof msg === 'string' ? msg : 'Erreur de chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getInterventionCount = (techId) => {
    return interventions.filter(i => i.technicien?.id === techId).length;
  };

  const filteredData = technicians.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.nom?.toLowerCase().includes(q) ||
      t.prenom?.toLowerCase().includes(q) ||
      t.email?.toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      nom: item.nom || '',
      prenom: item.prenom || '',
      email: item.email || ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.nom.trim()) errors.nom = 'Le nom est requis';
    if (!form.prenom.trim()) errors.prenom = 'Le prénom est requis';
    if (!form.email.trim()) errors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email invalide';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await technicienService.update(editingId, form);
        showToast('Technicien mis à jour avec succès', 'success');
      } else {
        await technicienService.create(form);
        showToast('Technicien créé avec succès', 'success');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Erreur lors de l\'enregistrement';
      showToast(typeof msg === 'string' ? msg : 'Erreur lors de l\'enregistrement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await technicienService.delete(deleteDialog.id);
      showToast('Technicien supprimé avec succès', 'success');
      fetchData();
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const columns = [
    { key: 'id', title: 'ID', width: '60px' },
    { key: 'nom', title: 'Nom', sortable: true },
    { key: 'prenom', title: 'Prénom', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    {
      key: 'interventions',
      title: 'Interventions',
      sortable: false,
      align: 'right',
      render: (row) => (
        <span className="tech-interv-count">
          {getInterventionCount(row.id)}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      sortable: false,
      align: 'right',
      render: (row) => (
        <div className="table-actions">
          {hasRole('ADMIN') && (
            <>
              <button className="table-actions__btn" onClick={() => openEdit(row)} title="Modifier">
                ✏️
              </button>
              <button className="table-actions__btn table-actions__btn--danger" onClick={() => setDeleteDialog({ open: true, id: row.id })} title="Supprimer">
                🗑️
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page">
      <Card
        title="Techniciens"
        subtitle={`${filteredData.length} technicien(s)`}
        actions={hasRole('ADMIN') && (
          <Button variant="primary" onClick={openCreate}>
            + Ajouter Technicien
          </Button>
        )}
      >
        <div className="filters">
          <SearchBar placeholder="Rechercher un technicien..." onSearch={setSearchQuery} />
        </div>

        {error ? (
          <>
            <EmptyState title="Erreur de chargement" message={error} />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button variant="primary" onClick={fetchData}>Réessayer</Button>
            </div>
          </>
        ) : filteredData.length === 0 ? (
          <EmptyState title="Aucun technicien trouvé" message="Créez un nouveau technicien pour commencer." />
        ) : (
          <Table
            columns={columns}
            data={filteredData}
            keyExtractor={(row) => row.id}
            sortable
            pagination
            pageSize={10}
          />
        )}
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Modifier le technicien' : 'Nouveau Technicien'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              {editingId ? 'Enregistrer' : 'Créer'}
            </Button>
          </>
        }
      >
        <div className="form-grid">
          <Input
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            error={formErrors.nom}
            required
          />
          <Input
            label="Prénom"
            name="prenom"
            value={form.prenom}
            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
            error={formErrors.prenom}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={formErrors.email}
            required
          />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Supprimer le technicien"
        message="Êtes-vous sûr de vouloir supprimer ce technicien ?"
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};

export default Technicians;
