import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { LayoutDashboard, CheckSquare, Settings as SettingsIcon, LogOut, Columns, Grid, Menu, X, Loader2, Moon, Sun } from 'lucide-react';
import Dashboard from './components/Dashboard';
import TaskTable from './components/TaskTable';
import KanbanBoard from './components/KanbanBoard';
import EisenhowerMatrix from './components/EisenhowerMatrix';
import AddTaskModal from './components/AddTaskModal';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [settings, setSettings] = useState({ users: [], projects: [] });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskData, setEditTaskData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSZ7o3cXQMaWIn_xPdTthvO11g7s4u6So32rDrJXoX-arcwHHb8DemgvPr0q4rmpM85xFlUL0wZ_IUe/pub?output=csv';
  const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbylYsVMYZ9X3m3VGbRgwfueP7WzmZ3mkLWVjTm3pikFrJRul-YOjLZaPCwTOT3LH9Ke4g/exec';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Tasks via CSV
      const urlWithCacheBuster = `${SHEET_CSV_URL}&t=${Date.now()}`;
      Papa.parse(urlWithCacheBuster, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const validRows = results.data.filter(row => row['Objective/KR'] && row['Objective/KR'].trim() !== '');
          const fetchedTasks = validRows.map((row, index) => {
            const estimate = parseFloat(row['Estimate Point']) || 0;
            const done = parseFloat(row['Done Point']) || 0;
            let progress = estimate > 0 ? Math.round((done / estimate) * 100) : 0;
            
            const status = row['Status'] || '🚦 Chưa bắt đầu';
            if (status.toLowerCase().includes('hoàn thành') || status.toLowerCase().includes('done')) {
              progress = 100;
            }

            return {
              id: `T-${index + 1}`,
              goal: row['Goal'] || '',
              name: row['Objective/KR'] || 'Untitled',
              category: row['Project'] || 'No Project',
              assignee: row['Owner'] || 'Unassigned',
              participants: row['Participants'] || '',
              priority: row['Priority'] || '🧊 Thấp',
              status: row['Status'] || '🚦 Chưa bắt đầu',
              dueDate: row['Due Date'] || '-',
              points: parseFloat(row['Points']) || estimate || 0,
              week: row['Week'] || row['Week (1 or 2)'] || '',
              createdDate: row['Created Date'] || '',
              updatedDate: row['Updated Date'] || '',
              progress: progress > 100 ? 100 : progress
            };
          });
          setTasks(fetchedTasks);
        }
      });

      // 2. Fetch Settings and Notes via Web App API
      const response = await fetch(WEB_APP_URL);
      const data = await response.json();
      
      if (data.notes) {
        const parsedNotes = data.notes.map(row => ({
          id: row[0],
          text: row[1],
          author: row[2],
          timestamp: row[3]
        }));
        setNotes(parsedNotes);
      }
      
      if (data.settings) {
        const users = data.settings.filter(row => row[0] === 'User').map(row => row[1]);
        const projects = data.settings.filter(row => row[0] === 'Project').map(row => row[1]);
        setSettings({ users, projects });
      }
      
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu từ API. Hãy kiểm tra kết nối mạng.");
      setLoading(false);
    }
  }, [SHEET_CSV_URL]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  // --- API Handlers ---
  const sendPostRequest = async (payload) => {
    return fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  };

  const handleSaveTaskSubmit = async (formData, oldTaskName) => {
    setIsSubmitting(true);
    try {
      if (oldTaskName) {
        // Edit mode Optimistic Update
        const updatedData = { ...formData, updatedDate: new Date().toISOString() };
        setTasks(prev => prev.map(t => t.name === oldTaskName ? { ...t, ...updatedData } : t));
        await sendPostRequest({ action: 'editTask', oldTaskName, ...updatedData });
      } else {
        // Add mode Optimistic Update
        const newTask = {
          id: `T-Mới-${Date.now().toString().slice(-4)}`,
          goal: formData.goal || '',
          name: formData.name || 'Untitled',
          category: formData.category || 'No Project',
          assignee: formData.assignee || 'Unassigned',
          participants: formData.participants || '',
          priority: formData.priority || '🧊 Thấp',
          status: formData.status || '🚦 Chưa bắt đầu',
          dueDate: formData.dueDate || '-',
          points: formData.points || 0,
          week: formData.week || '',
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString(),
          progress: 0
        };
        setTasks(prev => [...prev, newTask]);
        await sendPostRequest({ action: 'addTask', ...newTask });
      }
      setTimeout(() => {
        setIsModalOpen(false);
        setIsSubmitting(false);
        setEditTaskData(null);
      }, 500);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleEditTaskClick = (task) => {
    setEditTaskData(task);
    setIsModalOpen(true);
  };

  const handleAddNote = async (note) => {
    const newNote = { id: Date.now().toString(), ...note };
    setNotes(prev => [...prev, newNote]); // Optimistic UI update
    await sendPostRequest({ action: 'addNote', note: newNote });
  };

  const handleDeleteNote = async (noteId) => {
    setNotes(prev => prev.filter(n => n.id !== noteId)); // Optimistic UI update
    await sendPostRequest({ action: 'deleteNote', noteId });
  };

  const handleDeleteTask = async (taskName) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa task "${taskName}" không?`)) return;
    
    // Optimistic UI Update
    setTasks(prev => prev.filter(t => t.name !== taskName));
    
    try {
      await sendPostRequest({ action: 'deleteTask', taskName });
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  const handleUpdateTaskStatus = async (taskName, newStatus) => {
    // Optimistic UI Update
    setTasks(prev => prev.map(t => {
      if (t.name === taskName) {
        let newProgress = t.progress;
        if (newStatus.toLowerCase().includes('hoàn thành') || newStatus.toLowerCase().includes('done')) {
          newProgress = 100;
        }
        return { ...t, status: newStatus, progress: newProgress };
      }
      return t;
    }));
    
    try {
      await sendPostRequest({ action: 'updateTaskStatus', taskName, newStatus });
    } catch (err) {
      console.error('Failed to update task status', err);
      // Optional: rollback on error
    }
  };

  const handleSaveSettings = async (newSettings) => {
    setIsSavingSettings(true);
    try {
      const rows = [];
      newSettings.users.forEach(u => rows.push(['User', u]));
      newSettings.projects.forEach(p => rows.push(['Project', p]));
      
      await sendPostRequest({ action: 'saveSettings', settings: rows });
      
      setTimeout(() => {
        setSettings(newSettings);
        setIsSavingSettings(false);
        alert("Đã lưu cài đặt thành công!");
      }, 1500);
    } catch (err) {
      console.error(err);
      setIsSavingSettings(false);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: 'var(--bg-color)' }}>
        <Loader2 size={48} color="var(--primary)" className="animate-spin" />
        <p style={{ color: 'var(--text-main)', fontWeight: 600, fontFamily: 'var(--font-accent)' }}>Đang tải dữ liệu Live từ Google Sheets...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditTaskData(null); }} 
        onSubmit={handleSaveTaskSubmit}
        isSubmitting={isSubmitting}
        settings={settings}
        initialData={editTaskData}
      />

      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>

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
          <button className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start', padding: '1rem' }} onClick={() => handleTabClick('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className={`btn ${activeTab === 'kanban' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start', padding: '1rem' }} onClick={() => handleTabClick('kanban')}>
            <Columns size={20} /> Kanban Board
          </button>
          <button className={`btn ${activeTab === 'eisenhower' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start', padding: '1rem' }} onClick={() => handleTabClick('eisenhower')}>
            <Grid size={20} /> Eisenhower Matrix
          </button>
          <button className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start', padding: '1rem' }} onClick={() => handleTabClick('tasks')}>
            <CheckSquare size={20} /> Task List
          </button>
        </nav>

        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`} style={{ justifyContent: 'flex-start' }} onClick={() => handleTabClick('settings')}>
            <SettingsIcon size={20} /> Settings
          </button>
          <button className="btn btn-ghost" style={{ justifyContent: 'flex-start', color: 'var(--danger)' }}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

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
                {activeTab === 'settings' && 'System Settings'}
              </h2>
              <p style={{ margin: 0, marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                {loading ? 'Đang cập nhật dữ liệu...' : `Đã tải: ${tasks.length} tasks, ${notes.length} notes`}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%' }}
              title="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="btn btn-primary" onClick={() => { setEditTaskData(null); setIsModalOpen(true); }}>+ Add Task</button>
          </div>
        </header>

        <div style={{ flex: 1, paddingBottom: '2rem' }}>
          {activeTab === 'dashboard' && <Dashboard tasks={tasks} />}
          {activeTab === 'kanban' && <KanbanBoard tasks={tasks} notes={notes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} users={settings.users} onUpdateTaskStatus={handleUpdateTaskStatus} />}
          {activeTab === 'eisenhower' && <EisenhowerMatrix tasks={tasks} notes={notes} onAddNote={handleAddNote} onDeleteNote={handleDeleteNote} users={settings.users} onUpdateTaskStatus={handleUpdateTaskStatus} />}
          {activeTab === 'tasks' && <TaskTable tasks={tasks} onDeleteTask={handleDeleteTask} onEditTask={handleEditTaskClick} />}
          {activeTab === 'settings' && <Settings settings={settings} onSaveSettings={handleSaveSettings} isSaving={isSavingSettings} />}
        </div>
      </main>
    </div>
  );
}

export default App;
