import React from 'react';
import { STATUS_COLORS } from '../data';

export default function TaskTable({ tasks }) {
  const getStatusBadge = (status) => {
    const color = STATUS_COLORS[status] || '#cbd5e1';
    return (
      <span style={{
        background: `${color}15`,
        color: color,
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        border: `1px solid ${color}30`
      }}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    let color = '#94a3b8';
    if (priority === '🚨 Khẩn cấp') color = '#ef4444';
    if (priority === '🔥 Cao') color = '#f97316';
    if (priority === '⚡ Trung bình') color = '#3b82f6';
    if (priority === '🧊 Thấp') color = '#94a3b8';

    return (
      <span style={{
        color: color,
        fontWeight: 700,
        fontSize: '0.75rem',
        whiteSpace: 'nowrap'
      }}>
        {priority}
      </span>
    );
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-accent)' }}>Danh sách công việc (All Tasks)</h3>
        <button className="btn btn-primary">Add Task</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Task</th>
              <th>Category</th>
              <th>Assignee</th>
              <th>DoD Progress</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{task.id}</td>
                <td>{getStatusBadge(task.status)}</td>
                <td>{getPriorityBadge(task.priority)}</td>
                <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>{task.name}</td>
                <td style={{ color: 'var(--text-muted)' }}>{task.category}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', fontWeight: 500 }}>
                    <div style={{ 
                      width: '24px', height: '24px', borderRadius: '50%', 
                      background: 'var(--primary)', color: 'var(--text-main)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700
                    }}>
                      {task.assignee.charAt(0)}
                    </div>
                    {task.assignee}
                  </div>
                </td>
                <td style={{ width: '150px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="progress-bar-bg" style={{ flex: 1 }}>
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${task.progress}%`, background: STATUS_COLORS[task.status] || 'var(--primary)' }}
                      ></div>
                    </div>
                    <span style={{ fontSize: '0.75rem', minWidth: '35px', fontWeight: 600, color: 'var(--text-muted)' }}>{task.progress}%</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
