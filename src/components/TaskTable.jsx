import React, { useState } from 'react';
import { getStatusColor, getPriorityColor } from '../helpers';
import { Trash2, Search } from 'lucide-react';

export default function TaskTable({ tasks, onDeleteTask, onEditTask }) {
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    return (
      <span style={{
        background: `${color}15`,
        color: color,
        padding: '0.25rem 0.75rem',
        borderRadius: '99px',
        fontSize: '0.75rem',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap'
      }}>
        <span style={{width: '6px', height: '6px', borderRadius: '50%', background: color, marginRight: '6px'}}></span>
        {status}
      </span>
    );
  };

  const filteredTasks = tasks.filter(t => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return (t.name || '').toLowerCase().includes(lowerQ) || 
           (t.category || '').toLowerCase().includes(lowerQ) ||
           (t.assignee || '').toLowerCase().includes(lowerQ);
  });

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-accent)', fontSize: '1.1rem', color: 'var(--text-main)' }}>Task List</h3>
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm task, dự án, người phụ trách..." 
            style={{ 
              width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', 
              borderRadius: '8px', border: '1px solid var(--card-border)',
              background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none'
            }}
          />
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--card-border)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Task Name</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Project</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Priority</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Due Date</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr 
                key={task.id} 
                style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer', transition: 'background 0.2s' }}
                onClick={() => onEditTask(task)}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{task.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Owner: {task.assignee || 'Unassigned'}</div>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{task.category || '-'}</td>
                <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(task.status)}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ color: getPriorityColor(task.priority), fontWeight: 700, fontSize: '0.85rem' }}>
                    {task.priority || '-'}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>{task.dueDate}</td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteTask(task.name); }} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.5rem', borderRadius: '6px', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    title="Xóa Task"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Không tìm thấy công việc nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
