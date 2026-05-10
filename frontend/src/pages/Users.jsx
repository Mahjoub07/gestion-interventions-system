import React, { useState, useEffect } from 'react';
import { useToast } from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import SearchBar from '../components/common/SearchBar';
import Table from '../components/common/Table';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { RoleBadge } from '../components/common/StatusBadge';
import userService from '../services/userService';
import { ROLE_LABELS } from '../utils/constants';
import './Users.css';

const INITIAL_FORM = { nom: '', prenom: '', email: '', password: '', role: 'USER' };
const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label }));

const ROLE_ORDER = ['ADMIN', 'USER', 'TECHNICIAN'];
const ROLE_SECTION_ICONS = {
  ADMIN: '👤',
  USER: '🎓',
  TECHNICIAN: '🔧'
};

const columns = [
  { key: 'id', title: 'ID', width: '60px' },
  { key: 'nom', title: 'Nom', sortable: true },
  { key: 'prenom', title: 'Prénom', sortable: true },
  { key: 'email', title: 'Email', sortable: true },
  { key: 'role', title: 'Rôle', sortable: true, render: (row) => <RoleBadge role={row.role} /> },
  {
    key: 'actions',
    title: 'Actions',
    sortable: false,
    align: 'right',
    render: (row, _data, extra) => (
      <div className="table-actions">
        <button
          className="table-actions__btn table-actions__btn--danger"
          onClick={() => extra.onDelete(row.id)}
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    )
  }
];

const Users = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.getAll();
      setUsers(res.data || []);
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

  const filteredUsers = users.filter((u) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.nom?.toLowerCase().includes(q) ||
      u.prenom?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const usersByRole = ROLE_ORDER.reduce((acc, role) => {
    acc[role] = filteredUsers.filter((u) => u.role === role);
    return acc;
  }, {});

  const openCreate = () => {
    setForm(INITIAL_FORM);
    setFormErrors({});
    setShowPassword(false);
    setModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!form.nom.trim()) errors.nom = 'Le nom est requis';
    if (!form.prenom.trim()) errors.prenom = 'Le prénom est requis';
    if (!form.email.trim()) errors.email = 'L\'email est requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email invalide';
    if (!form.password.trim()) errors.password = 'Le mot de passe est requis';
    else if (form.password.length < 4) errors.password = 'Minimum 4 caractères';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await userService.create(form);
      showToast('Utilisateur créé avec succès', 'success');
      setModalOpen(false);
      setForm(INITIAL_FORM);
      // Refresh data without full page reload
      const res = await userService.getAll();
      setUsers(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || err.message || 'Erreur lors de la création';
      showToast(typeof msg === 'string' ? msg : 'Erreur lors de la création', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await userService.delete(deleteDialog.id);
      showToast('Utilisateur supprimé avec succès', 'success');
      setDeleteDialog({ open: false, id: null });
      const res = await userService.getAll();
      setUsers(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Erreur lors de la suppression';
      showToast(typeof msg === 'string' ? msg : 'Erreur lors de la suppression', 'error');
      setDeleteDialog({ open: false, id: null });
    }
  };

  const totalCount = filteredUsers.length;

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="page">
      {/* Header Card */}
      <Card
        title="Gestion des Utilisateurs"
        subtitle={`${totalCount} utilisateur(s) au total`}
        actions={
          <Button variant="primary" onClick={openCreate}>
            + Nouvel Utilisateur
          </Button>
        }
      >
        <div className="filters">
          <SearchBar
            placeholder="Rechercher par nom, email, rôle..."
            onSearch={setSearchQuery}
          />
        </div>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="users-error-card">
          <EmptyState
            title="Erreur de chargement"
            message={error}
          />
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Button variant="primary" onClick={fetchData}>Réessayer</Button>
          </div>
        </Card>
      )}

      {/* Role Sections */}
      {!error && (
        <div className="users-sections">
          {ROLE_ORDER.map((role) => {
            const sectionUsers = usersByRole[role];
            const roleLabel = ROLE_LABELS[role] || role;
            const icon = ROLE_SECTION_ICONS[role];

            return (
              <Card
                key={role}
                title={`${icon} ${roleLabel}s`}
                subtitle={`${sectionUsers.length} ${roleLabel.toLowerCase()}(s)`}
                className="users-section-card"
              >
                {sectionUsers.length === 0 ? (
                  <EmptyState
                    title={`Aucun ${roleLabel.toLowerCase()}`}
                    message={`Créez un ${roleLabel.toLowerCase()} pour commencer.`}
                  />
                ) : (
                  <Table
                    columns={columns}
                    data={sectionUsers}
                    keyExtractor={(row) => row.id}
                    sortable
                    pagination
                    pageSize={5}
                    extra={{ onDelete: (id) => setDeleteDialog({ open: true, id }) }}
                  />
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nouvel Utilisateur"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              Créer
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
          <div className="password-field">
            <Input
              label="Mot de passe"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              error={formErrors.password}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <Select
            label="Rôle"
            name="role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={roleOptions}
            required
          />
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Supprimer l'utilisateur"
        message="Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
        confirmText="Supprimer"
        variant="danger"
      />
    </div>
  );
};

export default Users;
