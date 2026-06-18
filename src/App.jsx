import React, { useState } from 'react';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Columns, Grid, Menu, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TaskTable from './components/TaskTable';
import KanbanBoard from './components/KanbanBoard';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import { mockTasks } from './data';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState(mockTasks);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile when a tab is selected
  };

  return (
    <div className="app-container">
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-accent)' }}>
              <img src="https://biplus.com.vn/assets/image/meta-image.png" alt="Biplus Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              TaskTracker
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Workspace v3.0</p>
          </div>
          <button className="mobile-menu-btn" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '2rem' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start', padding: '1rem' }}
            onClick={() => handleTabClick('dashboard')}
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>
          
          <button 
            className={`btn ${activeTab === 'kanban' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start', padding: '1rem' }}
            onClick={() => handleTabClick('kanban')}
          >
            <Columns size={20} />
            Kanban Board
          </button>

          <button 
            className={`btn ${activeTab === 'eisenhower' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start', padding: '1rem' }}
            onClick={() => handleTabClick('eisenhower')}
          >
            <Grid size={20} />
            Eisenhower Matrix
          </button>

          <button 
            className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ justifyContent: 'flex-start', padding: '1rem' }}
            onClick={() => handleTabClick('tasks')}
          >
            <CheckSquare size={20} />
            Task List
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start' }}>
            <Settings size={20} />
            Settings
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--danger)' }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={toggleSidebar} style={{ padding: '0', marginTop: '5px' }}>
              <Menu size={24} />
            </button>
            <div>
              <h2 style={{ margin: 0, fontFamily: 'var(--font-accent)' }}>
                {activeTab === 'dashboard' && 'Dashboard Overview'}
                {activeTab === 'kanban' && 'Kanban Board'}
                {activeTab === 'eisenhower' && 'Eisenhower Matrix'}
                {activeTab === 'tasks' && 'Task Management'}
              </h2>
              <p style={{ margin: 0, marginTop: '0.25rem', color: 'var(--text-muted)' }}>Welcome back, Thu!</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: '999px', background: 'var(--card-bg)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--text-main)' }}>
                T
              </div>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Thu Nguyen</span>
            </div>
          </div>
        </header>

        <div style={{ flex: 1, paddingBottom: '2rem' }}>
          {activeTab === 'dashboard' && <Dashboard tasks={tasks} />}
          {activeTab === 'kanban' && <KanbanBoard tasks={tasks} />}
          {activeTab === 'eisenhower' && <EisenhowerMatrix tasks={tasks} />}
          {activeTab === 'tasks' && <TaskTable tasks={tasks} />}
        </div>
      </main>
    </div>
  );
}

export default App;
