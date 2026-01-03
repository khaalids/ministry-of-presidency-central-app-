import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import { useAuth } from '../../contexts/AuthContext';
import { taskService } from '../../services/taskService';
import { departmentService } from '../../services/departmentService';
import TaskCard from './components/TaskCard';
import CreateTaskModal from './components/CreateTaskModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const TaskManagement = () => {
  const { userProfile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  const isLeadership = userProfile?.role === 'dg' || userProfile?.role === 'minister' || userProfile?.role === 'admin';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, departmentsData] = await Promise.all([
        taskService?.getAllTasks(),
        departmentService?.getAllDepartments()
      ]);
      setTasks(tasksData);
      setDepartments(departmentsData);
    } catch (err) {
      setError(err?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService?.createTask(taskData);
      setIsCreateModalOpen(false);
      loadData();
    } catch (err) {
      setError(err?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskId, updates) => {
    try {
      await taskService?.updateTask(taskId, updates);
      loadData();
    } catch (err) {
      setError(err?.message || 'Failed to update task');
    }
  };

  const filteredTasks = tasks?.filter(task => {
    if (filterStatus !== 'all' && task?.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task?.priority !== filterPriority) return false;
    return true;
  });

  const statusCounts = {
    all: tasks?.length || 0,
    pending: tasks?.filter(t => t?.status === 'pending')?.length || 0,
    in_progress: tasks?.filter(t => t?.status === 'in_progress')?.length || 0,
    completed: tasks?.filter(t => t?.status === 'completed')?.length || 0
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background pt-20">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Task Management - Ministry Dashboard</title>
      </Helmet>
      <Header />
      <div className="min-h-screen bg-background pt-20">
        <div className="px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Task Management
              </h1>
              <p className="text-muted-foreground">
                {isLeadership ? 'Assign and monitor tasks across departments' : 'View and manage your assigned tasks'}
              </p>
            </div>
            {isLeadership && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                iconName="Plus"
                iconPosition="left"
                size="lg"
              >
                Assign Task
              </Button>
            )}
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setFilterStatus('all')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'all' ?'bg-primary text-primary-foreground border-primary' :'bg-card border-border hover:border-primary'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.all}</div>
              <div className="text-sm mt-1">All Tasks</div>
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'pending' ?'bg-warning text-warning-foreground border-warning' :'bg-card border-border hover:border-warning'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.pending}</div>
              <div className="text-sm mt-1">Pending</div>
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'in_progress' ?'bg-accent text-accent-foreground border-accent' :'bg-card border-border hover:border-accent'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.in_progress}</div>
              <div className="text-sm mt-1">In Progress</div>
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`p-4 rounded-lg border transition-smooth ${
                filterStatus === 'completed'
                  ? 'bg-success text-success-foreground border-success' :'bg-card border-border hover:border-success'
              }`}
            >
              <div className="text-2xl font-bold">{statusCounts?.completed}</div>
              <div className="text-sm mt-1">Completed</div>
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e?.target?.value)}
              className="px-4 py-2 rounded-lg border border-border bg-card text-foreground"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTasks?.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Icon name="Inbox" size={64} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">No tasks found</p>
              </div>
            ) : (
              filteredTasks?.map(task => (
                <TaskCard
                  key={task?.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  isLeadership={isLeadership}
                />
              ))
            )}
          </div>
        </div>
      </div>
      {isCreateModalOpen && (
        <CreateTaskModal
          departments={departments}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateTask}
        />
      )}
    </>
  );
};

export default TaskManagement;