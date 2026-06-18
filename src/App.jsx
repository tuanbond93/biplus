import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Columns, Grid, Menu, X, Loader2 } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TaskTable from './components/TaskTable';
import KanbanBoard from './components/KanbanBoard';
import EisenhowerMatrix from './components/EisenhowerMatrix';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // The published Google Sheet CSV URL
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZ7o3cXQMaWIn_xPdTthvO11g7s4u6So32rDrJXoX-arcwHHb8DemgvPr0q4rmpM85xFlUL0wZ_IUe/pub?output=csv';

  useEffect(() => {
    Papa.parse(SHEET_CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          // Filter out truly empty rows that might just contain FALSE
          const validRows = results.data.filter(row => row['Objective/KR'] && row['Objective/KR'].trim() !== '');
          
          if (validRows.length === 0) {
            console.warn("No valid tasks found. Did you enter data?");
          }

          const fetchedTasks = validRows.map((row, index) => {
            const estimate = parseFloat(row['Estimate Point']) || 0;
            const done = parseFloat(row['Done Point']) || 0;
            const progress = estimate > 0 ? Math.round((done / estimate) * 100) : 0;
            
            return {
              id: `T-${index + 1}`,
              name: row['Objective/KR'] || 'Untitled',
              category: row['Project'] || 'No Project',
              assignee: row['Owner'] || 'Unassigned',
              priority: row['Priority'] || 'Thấp',
              status: row['Status'] || 'Chưa bắt đầu',
              dueDate: row['Due Date'] || '-',
              progress: progress > 100 ? 100 : progress
            };
          });

          setTasks(fetchedTasks);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      },
      error: (error) => {
        setError(error.message);
        setLoading(false);
      }
    });
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile when a tab is selected
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: 'var(--bg-main)' }}>
        <Loader2 size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-main)', fontWeight: 600, fontFamily: 'var(--font-accent)' }}>Đang tải dữ liệu Live từ Google Sheets...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--danger)', flexDirection: 'column', gap: '1rem' }}>
        <h2>Lỗi kết nối dữ liệu</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

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
              <p style={{ margin: 0, marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                {tasks.length === 0 ? 'Chưa có task nào trên Google Sheet!' : `Đang hiển thị ${tasks.length} tasks từ Live Data`}
              </p>
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
