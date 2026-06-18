import React from 'react';

export default function EisenhowerMatrix({ tasks }) {
  const doFirst = tasks.filter(t => t.priority === '🚨 Khẩn cấp');
  const schedule = tasks.filter(t => t.priority === '🔥 Cao');
  const delegate = tasks.filter(t => t.priority === '⚡ Trung bình');
  const dontDo = tasks.filter(t => t.priority === '🧊 Thấp');

  const renderQuadrant = (title, subtitle, quadrantTasks, bgColor) => (
    <div style={{
      background: bgColor,
      borderRadius: '12px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      minHeight: '300px',
      border: '1px solid var(--card-border)'
    }}>
      <div>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-accent)' }}>{title}</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0', fontWeight: 600 }}>{subtitle}</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', flex: 1 }}>
        {quadrantTasks.map(task => (
          <div key={task.id} style={{
            background: 'var(--card-bg)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--card-border)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '0.875rem' }}>{task.name}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              <span>{task.status}</span>
              <span>Due: {task.dueDate}</span>
            </div>
          </div>
        ))}
        {quadrantTasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontWeight: 600 }}>
            No tasks
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-accent)' }}>Eisenhower Matrix</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }}>
        {renderQuadrant('DO FIRST', 'Important & Urgent', doFirst, 'rgba(239, 68, 68, 0.05)')}
        {renderQuadrant('SCHEDULE', 'Important & Not Urgent', schedule, 'rgba(59, 130, 246, 0.05)')}
        {renderQuadrant('DELEGATE', 'Not Important & Urgent', delegate, 'rgba(245, 158, 11, 0.05)')}
        {renderQuadrant('DON\'T DO', 'Not Important & Not Urgent', dontDo, 'rgba(148, 163, 184, 0.05)')}
      </div>
    </div>
  );
}
