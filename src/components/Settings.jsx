import React, { useState } from 'react';
import { Trash2, Save, Plus, Loader2 } from 'lucide-react';

export default function Settings({ settings, onSaveSettings, isSaving }) {
  // settings is { users: ['Thu', 'Tuan'], projects: ['Portal', 'App'] }
  const [users, setUsers] = useState(settings.users || []);
  const [projects, setProjects] = useState(settings.projects || []);
  
  const [newUser, setNewUser] = useState('');
  const [newProject, setNewProject] = useState('');

  const handleAddUser = () => {
    if (newUser.trim() && !users.includes(newUser.trim())) {
      setUsers([...users, newUser.trim()]);
      setNewUser('');
    }
  };

  const handleAddProject = () => {
    if (newProject.trim() && !projects.includes(newProject.trim())) {
      setProjects([...projects, newProject.trim()]);
      setNewProject('');
    }
  };

  const handleDeleteUser = (u) => setUsers(users.filter(user => user !== u));
  const handleDeleteProject = (p) => setProjects(projects.filter(proj => proj !== p));

  const handleSave = () => {
    onSaveSettings({ users, projects });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-accent)', color: 'var(--text-main)' }}>Cài đặt Hệ thống (Settings)</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>Quản lý danh sách Người phụ trách và Dự án chuẩn</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
        >
          {isSaving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
          {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* Users Management */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>👤 Quản lý Nhân sự (Owner)</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newUser} 
              onChange={e => setNewUser(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddUser()}
              placeholder="Thêm tên nhân sự..." 
              style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '0.9rem' }}
            />
            <button onClick={handleAddUser} className="btn btn-primary" style={{ padding: '0 1rem' }}><Plus size={20} /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {users.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Chưa có dữ liệu</p>}
            {users.map(u => (
              <div key={u} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{u}</span>
                <button onClick={() => handleDeleteUser(u)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Management */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--card-bg)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>📁 Quản lý Dự án (Project)</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newProject} 
              onChange={e => setNewProject(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddProject()}
              placeholder="Thêm tên dự án..." 
              style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '0.9rem' }}
            />
            <button onClick={handleAddProject} className="btn btn-primary" style={{ padding: '0 1rem' }}><Plus size={20} /></button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
            {projects.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Chưa có dữ liệu</p>}
            {projects.map(p => (
              <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{p}</span>
                <button onClick={() => handleDeleteProject(p)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
