import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Textarea from '../components/common/Textarea';
import SearchBar from '../components/common/SearchBar';
import Table from '../components/common/Table';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { InterventionStatusBadge } from '../components/common/StatusBadge';
import interventionService from '../services/interventionService';
import technicienService from '../services/technicienService';
import userService from '../services/userService';
import { STATUT_LABELS } from '../utils/constants';
import { formatDate, truncate, formatDateInput } from '../utils/helpers';
import './Interventions.css';

const INITIAL_FORM = {
  titre: '', description: '', dateIntervention: '', statut: 'EN_ATTENTE',
  technicienId: '', userId: ''
};

const Interventions = () => {
  const { hasRole, user } = useAuth();
  const { showToast } = useToast();
  const [interventions, setInterventions] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
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
      let intervRes;
      if (hasRole('TECHNICIAN')) {
        intervRes = await interventionService.getByTechnicien(user.id);
      } else if (hasRole('USER')) {
        intervRes = await interventionService.getByUser(user.id);
      } else {
        intervRes = await interventionService.getAll();
      }
      const [techRes, userRes] = await Promise.all([
        technicienService.getAll(), userService.getAll()
      ]);
      setInterventions(intervRes.data || []);
      setTechniciens(techRes.data || []);
      setUsers(userRes.data || []);
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

  const filteredData = interventions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      (item.titre?.toLowerCase().includes(q)) ||
      (item.description?.toLowerCase().includes(q));
    const matchesStatus = !statusFilter || item.statut === statusFilter;
    const matchesDateFrom = !dateFrom || (item.dateIntervention && new Date(item.dateIntervention) >= new Date(dateFrom));
    const matchesDateTo = !dateTo || (item.dateIntervention && new Date(item.dateIntervention) <= new Date(dateTo + 'T23:59:59'));
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...INITIAL_FORM,
      userId: hasRole('USER') ? user.id.toString() : ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      titre: item.titre || '', description: item.description || '',
      dateIntervention: formatDateInput(item.dateIntervention),
      statut: item.statut || 'EN_ATTENTE',
      technicienId: item.technicien?.id?.toString() || '',
      userId: item.user?.id?.toString() || ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.titre.trim()) errors.titre = 'Le titre est requis';
    if (!form.description.trim()) errors.description = 'La description est requise';
    if (!form.dateIntervention) errors.dateIntervention = 'La date est requise';
    if (!isUserCreating && !form.technicienId) errors.technicienId = 'Le technicien est requis';
    if (!form.userId) errors.userId = 'Le demandeur est requis';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { ...form, user: { id: Number(form.userId) } };
      if (form.technicienId) {
        payload.technicien = { id: Number(form.technicienId) };
      }
      if (editingId) {
        await interventionService.update(editingId, payload);
        showToast('Intervention mise à jour avec succès', 'success');
      } else {
        await interventionService.create(payload);
        showToast('Intervention créée avec succès', 'success');
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
      await interventionService.delete(deleteDialog.id);
      showToast('Intervention supprimée avec succès', 'success');
      fetchData();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Erreur lors de la suppression';
      showToast(typeof msg === 'string' ? msg : 'Erreur lors de la suppression', 'error');
    } finally {
      setDeleteDialog({ open: false, id: null });
    }
  };

  const canEdit = hasRole('ADMIN') || hasRole('TECHNICIAN');
  const canDelete = hasRole('ADMIN');
  const canCreate = hasRole('ADMIN') || hasRole('USER');
  const isTechnicianEditing = editingId && hasRole('TECHNICIAN');
  const isUserCreating = !editingId && hasRole('USER');

  const statusOptions = Object.entries(STATUT_LABELS).map(([value, label]) => ({ value, label }));
  const techOptions = techniciens.map(t => ({ value: t.id.toString(), label: `${t.prenom} ${t.nom}` }));
  const userOptions = users.map(u => ({ value: u.id.toString(), label: `${u.prenom} ${u.nom}` }));

  const columns = [
    { key: 'id', title: 'ID', width: '60px' },
    { key: 'titre', title: 'Titre', sortable: true },
    { key: 'description', title: 'Description', sortable: false, render: (row) => truncate(row.description, 50) },
    { key: 'dateIntervention', title: 'Date', sortable: true, render: (row) => formatDate(row.dateIntervention) },
    { key: 'statut', title: 'Statut', sortable: true, render: (row) => <InterventionStatusBadge status={row.statut} /> },
    { key: 'technicien', title: 'Technicien', sortable: false, render: (row) => row.technicien ? `${row.technicien.prenom} ${row.technicien.nom}` : '-' },
    { key: 'user', title: 'Demandeur', sortable: false, render: (row) => row.user ? `${row.user.prenom} ${row.user.nom}` : '-' },
    {
      key: 'actions', title: 'Actions', sortable: false, align: 'right',
      render: (row) => (
        <div className="table-actions">
          {canEdit && (
            <button className="table-actions__btn" onClick={() => openEdit(row)} title="Modifier">✏️</button>
          )}
          {canDelete && (
            <button className="table-actions__btn table-actions__btn--danger" onClick={() => setDeleteDialog({ open: true, id: row.id })} title="Supprimer">🗑️</button>
          )}
        </div>
      )
    }
  ];

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page">
      <Card title="Interventions" subtitle={`${filteredData.length} intervention(s)`}
        actions={canCreate && <Button variant="primary" onClick={openCreate}>+ Nouvelle Intervention</Button>}
      >
        <div className="filters">
          <SearchBar placeholder="Rechercher par titre ou description..." onSearch={setSearchQuery} />
          <Select name="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: '', label: 'Tous les statuts' }, ...statusOptions]} placeholder="Statut" />
          <div className="filters__date-range">
            <Input type="date" name="dateFrom" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="Du" />
            <Input type="date" name="dateTo" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="Au" />
          </div>
        </div>

        {error ? (
          <>
            <EmptyState title="Erreur de chargement" message={error} />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button variant="primary" onClick={fetchData}>Réessayer</Button>
            </div>
          </>
        ) : filteredData.length === 0 ? (
          <EmptyState title="Aucune intervention trouvée" message="Modifiez vos filtres ou créez une nouvelle intervention." />
        ) : (
          <Table columns={columns} data={filteredData} keyExtractor={(row) => row.id} sortable pagination pageSize={10} />
        )}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Modifier l\'intervention' : 'Nouvelle Intervention'} size="lg"
        footer={<>
          <Button variant="secondary" onClick={() => setModalOpen(false)}>Annuler</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>{editingId ? 'Enregistrer' : 'Créer'}</Button>
        </>}
      >
        <div className="form-grid">
          <Input label="Titre" name="titre" value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} error={formErrors.titre} required disabled={isTechnicianEditing} />
          <Textarea label="Description" name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={formErrors.description} required disabled={isTechnicianEditing} />
          <Input label="Date d'intervention" name="dateIntervention" type="datetime-local" value={form.dateIntervention} onChange={(e) => setForm({ ...form, dateIntervention: e.target.value })} error={formErrors.dateIntervention} required disabled={isTechnicianEditing} />
          <Select label="Statut" name="statut" value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })} options={statusOptions} required disabled={isUserCreating} />
          <Select label="Technicien" name="technicienId" value={form.technicienId} onChange={(e) => setForm({ ...form, technicienId: e.target.value })} options={techOptions} error={formErrors.technicienId} placeholder="Choisir un technicien" required disabled={isTechnicianEditing || isUserCreating} />
          <Select label="Demandeur" name="userId" value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} options={userOptions} error={formErrors.userId} placeholder="Choisir un demandeur" required disabled={isUserCreating || isTechnicianEditing} />
        </div>
      </Modal>

      <ConfirmDialog isOpen={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })} onConfirm={handleDelete}
        title="Supprimer l'intervention" message="Êtes-vous sûr de vouloir supprimer cette intervention ? Cette action est irréversible."
        confirmText="Supprimer" variant="danger" />
    </div>
  );
};

export default Interventions;
