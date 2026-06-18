import React from 'react';
import { Clock } from 'lucide-react';
import { getStatusColor } from '../helpers';

export default function KanbanBoard({ tasks }) {
  const uniqueStatuses = [...new Set(tasks.map(t => t.status).filter(Boolean))];
  
  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-accent)' }}>Kanban Board</h2>
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        overflowX: 'auto', 
        paddingBottom: '1rem',
        minHeight: '600px'
      }}>
        {uniqueStatuses.map(status => {
          const columnTasks = getTasksByStatus(status);
          const color = getStatusColor(status);
          
          return (
            <div key={status} style={{
              flex: '0 0 300px',
              background: 'var(--card-bg)',
              borderRadius: '12px',
              padding: '1rem',
              borderTop: `4px solid ${color}`,
              border: '1px solid var(--card-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-main)' }}>{status}</h3>
                <span style={{ 
                  background: 'var(--card-border)', 
                  padding: '0.1rem 0.5rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)'
                }}>
                  {columnTasks.length}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {columnTasks.map(task => (
                  <div key={task.id} style={{ 
                    padding: '1rem', 
                    cursor: 'pointer',
                    background: '#fff',
                    border: '1px solid var(--card-border)',
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{task.id}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{task.priority}</span>
                    </div>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-main)', fontSize: '0.875rem' }}>{task.name}</h4>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ 
                          width: '24px', height: '24px', borderRadius: '50%', 
                          background: 'var(--primary)', color: 'var(--text-main)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.75rem', fontWeight: 700
                        }}>
                          {task.assignee ? task.assignee.charAt(0) : '?'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <Clock size={12} />
                        {task.dueDate}
                      </div>
                    </div>
                  </div>
                ))}
                
                {columnTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.875rem', border: '1px dashed var(--card-border)', borderRadius: '8px' }}>
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
