import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserTable from './components/UserTable';
import CreateUserModal from './components/CreateUserModal';
import EditUserModal from './components/EditUserModal';
import MinistryTable from './components/MinistryTable';
import CreateMinistryModal from './components/CreateMinistryModal';
import EditMinistryModal from './components/EditMinistryModal';
import { userService } from '../../services/userService';
import { departmentService } from '../../services/departmentService';
import { ministryService } from '../../services/ministryService';

const UserManagement = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin';

  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'ministries'
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateMinistryModalOpen, setIsCreateMinistryModalOpen] = useState(false);
  const [isEditMinistryModalOpen, setIsEditMinistryModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMinistry, setSelectedMinistry] = useState(null);
  const [filterRole, setFilterRole] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (userProfile && !isAdmin) {
      navigate('/executive-overview');
    }
  }, [userProfile, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, departmentsData, ministriesData] = await Promise.all([
        userService?.getAllUsers(),
        departmentService?.getAllDepartments(),
        ministryService?.getAllMinistries()
      ]);
      setUsers(usersData);
      setDepartments(departmentsData);
      setMinistries(ministriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await userService?.createUser(userData);
      await loadData();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await userService?.updateUser(userId, updates);
      await loadData();
      setIsEditModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      await userService?.deactivateUser(userId);
      await loadData();
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const handleReactivateUser = async (userId) => {
    try {
      await userService?.reactivateUser(userId);
      await loadData();
    } catch (error) {
      console.error('Error reactivating user:', error);
    }
  };

  const handleResetPassword = async (userId) => {
    try {
      await userService?.resetUserPassword(userId);
      alert('Password reset email sent successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to send password reset email');
    }
  };

  // Ministry handlers
  const handleCreateMinistry = async (ministryData) => {
    try {
      await ministryService?.createMinistry(ministryData);
      await loadData();
      setIsCreateMinistryModalOpen(false);
    } catch (error) {
      console.error('Error creating ministry:', error);
      throw error;
    }
  };

  const handleEditMinistry = (ministry) => {
    setSelectedMinistry(ministry);
    setIsEditMinistryModalOpen(true);
  };

  const handleUpdateMinistry = async (ministryId, updates) => {
    try {
      await ministryService?.updateMinistry(ministryId, updates);
      await loadData();
      setIsEditMinistryModalOpen(false);
      setSelectedMinistry(null);
    } catch (error) {
      console.error('Error updating ministry:', error);
      throw error;
    }
  };

  const handleDeleteMinistry = async (ministryId) => {
    try {
      await ministryService?.deleteMinistry(ministryId);
      await loadData();
    } catch (error) {
      console.error('Error deleting ministry:', error);
      alert('Failed to delete ministry. It may be in use.');
    }
  };

  const filteredUsers = users?.filter(user => {
    const matchesRole = filterRole === 'all' || user?.role === filterRole;
    const matchesDepartment = filterDepartment === 'all' || user?.departmentId === filterDepartment;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && user?.isActive) || 
      (filterStatus === 'inactive' && !user?.isActive);
    const matchesSearch = !searchQuery || 
      user?.fullName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      user?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return matchesRole && matchesDepartment && matchesStatus && matchesSearch;
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>User Management | Ministry Dashboard</title>
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                User Management
              </h1>
              <p className="text-muted-foreground">
                Manage users, roles, permissions, and ministries
              </p>
            </div>
            {activeTab === 'users' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth hover-lift press-scale"
            >
              <Icon name="UserPlus" size={20} strokeWidth={2} />
              <span className="font-body font-medium">Create User</span>
              </button>
            )}
            {activeTab === 'ministries' && (
              <button
                onClick={() => setIsCreateMinistryModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth hover-lift press-scale"
              >
                <Icon name="Building2" size={20} strokeWidth={2} />
                <span className="font-body font-medium">Create Ministry</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-body font-medium text-sm transition-smooth ${
                activeTab === 'users'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="Users" size={18} strokeWidth={2} />
                <span>Users</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ministries')}
              className={`px-6 py-3 font-body font-medium text-sm transition-smooth ${
                activeTab === 'ministries'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name="Building2" size={18} strokeWidth={2} />
                <span>Ministries</span>
              </div>
            </button>
          </div>

          {/* Users Tab Content */}
          {activeTab === 'users' && (
            <>

          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Search Users
                </label>
                <div className="relative">
                  <Icon
                    name="Search"
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Filter by Role
                </label>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e?.target?.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="dg">DG</option>
                  <option value="minister">Minister</option>
                  <option value="department_user">Department User</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Filter by Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e?.target?.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Departments</option>
                  {departments?.map(dept => (
                    <option key={dept?.id} value={dept?.id}>{dept?.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-body font-medium text-foreground mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e?.target?.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <UserTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onDeactivate={handleDeactivateUser}
                onReactivate={handleReactivateUser}
                onResetPassword={handleResetPassword}
              />
            )}
          </div>
            </>
          )}

          {/* Ministries Tab Content */}
          {activeTab === 'ministries' && (
            <div className="bg-card rounded-lg border border-border">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : (
                <MinistryTable
                  ministries={ministries}
                  onEdit={handleEditMinistry}
                  onDelete={handleDeleteMinistry}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <CreateUserModal
          departments={departments}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateUser}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          departments={departments}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedUser(null);
          }}
          onUpdate={handleUpdateUser}
        />
      )}

      {isCreateMinistryModalOpen && (
        <CreateMinistryModal
          onClose={() => setIsCreateMinistryModalOpen(false)}
          onCreate={handleCreateMinistry}
        />
      )}

      {isEditMinistryModalOpen && selectedMinistry && (
        <EditMinistryModal
          ministry={selectedMinistry}
          onClose={() => {
            setIsEditMinistryModalOpen(false);
            setSelectedMinistry(null);
          }}
          onUpdate={handleUpdateMinistry}
        />
      )}
    </>
  );
};

export default UserManagement;