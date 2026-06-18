import React, { useState } from 'react';
import { getStatusColor, getPriorityColor } from '../helpers';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export default function KanbanBoard({ tasks }) {
  const uniqueStatuses = ['🚦 Chưa bắt đầu', '⏳ Chờ xử lý', '🏃‍♂️ Đang thực hiện', '✅ Hoàn thành'];
  
  // Ensure we have at least the statuses in the image, plus any custom ones from tasks
  const allStatuses = [...new Set([...uniqueStatuses, ...tasks.map(t => t.status).filter(Boolean)])];

  const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

  const calculateDaysRem = (dueDateStr) => {
    if (!dueDateStr || dueDateStr === '-') return '-';
    // try to parse MM/DD/YYYY or DD/MM/YYYY. Assuming simple parsing for UI
    const parts = dueDateStr.split('/');
    let targetDate;
    if (parts.length === 3) {
      // Assuming DD/MM/YYYY
      targetDate = new Date(parts[2], parts[1] - 1, parts[0]);
    } else {
      targetDate = new Date(dueDateStr);
    }
    
    if (isNaN(targetDate.getTime())) return dueDateStr; // Return original if not a date
    
    const diffTime = targetDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Local state for Notes
  const [notes, setNotes] = useState([
    { id: 1, text: "Nhớ check báo cáo cuối tuần nhé!", author: "Thu Nguyen" }
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('');

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    setNotes(prev => [...prev, { id: Date.now(), text: newNoteText, author: newNoteAuthor || 'Anonymous' }]);
    setNewNoteText('');
  };

  const renderDonutChart = (columnTasksCount, totalTasksCount, color) => {
    const percentage = totalTasksCount > 0 ? (columnTasksCount / totalTasksCount) * 100 : 0;
    const data = [{ name: 'Tasks', value: percentage, fill: color }];

    return (
      <div style={{ width: '120px', height: '120px', position: 'relative', margin: '0 auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" 
            barSize={12} data={data} startAngle={90} endAngle={-270}
          >
            <RadialBar background={{ fill: 'var(--card-border)' }} dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ 
          position: 'absolute', top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{columnTasksCount}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Tasks</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      
      {/* LEFT SIDEBAR (Filter, Updater, Notes) */}
      <div style={{ 
        width: '260px', 
        flexShrink: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem',
        background: '#f8fafc',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--card-border)'
      }}>
        
        {/* FILTER BY */}
        <div style={{ background: '#fff', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>FILTER BY</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ color: '#3b82f6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>YEAR</div>
            <div><input type="text" defaultValue="2025" style={{ width: '100%', padding: '0.2rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}/></div>
            
            <div style={{ color: '#3b82f6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>MONTH</div>
            <div><input type="text" style={{ width: '100%', padding: '0.2rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}/></div>
            
            <div style={{ color: '#3b82f6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>WEEK</div>
            <div><input type="text" style={{ width: '100%', padding: '0.2rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}/></div>
            
            <div style={{ color: '#3b82f6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>OWNER</div>
            <div>
              <select style={{ width: '100%', padding: '0.2rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}>
                <option>👩‍💼 Tôi (Bản thân)</option>
                <option>Tất cả</option>
              </select>
            </div>
          </div>
        </div>

        {/* TASK UPDATER */}
        <div style={{ background: '#fff', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>TASK UPDATER</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>TASK</div>
            <div>-</div>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>DUE DATE</div>
            <div>-</div>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>STATUS</div>
            <div style={{ fontSize: '0.75rem' }}>🏃‍♂️ Đang thực hiện</div>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>PRIORITY</div>
            <div>-</div>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>OWNER</div>
            <div>-</div>
            <div style={{ color: '#10b981', fontWeight: 700, marginTop: '0.5rem' }}>Update?</div>
            <div style={{ marginTop: '0.5rem' }}><input type="checkbox" /></div>
          </div>
        </div>

        {/* NOTES */}
        <div style={{ background: '#fff', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>NOTES</h4>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', marginBottom: '1rem', maxHeight: '200px' }}>
            {notes.map(note => (
              <div key={note.id} style={{ background: '#fef08a', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid #facc15' }}>
                <p style={{ margin: '0 0 0.25rem 0', color: '#422006' }}>{note.text}</p>
                <span style={{ fontSize: '0.65rem', color: '#854d0e', fontWeight: 600 }}>- {note.author}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <textarea 
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Nhập ghi chú..." 
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.8rem', resize: 'vertical', minHeight: '60px' }}
            />
            <input 
              type="text" 
              value={newNoteAuthor}
              onChange={(e) => setNewNoteAuthor(e.target.value)}
              placeholder="Tên người note (VD: Thu)" 
              style={{ width: '100%', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.8rem' }}
            />
            <button 
              onClick={handleAddNote}
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              + Post Note
            </button>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>
              (Note lưu tạm thời trên trình duyệt)
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT BOARD (Kanban Columns) */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        gap: '1.5rem', 
        overflowX: 'auto', 
        paddingBottom: '1rem'
      }}>
        {allStatuses.map(status => {
          const columnTasks = getTasksByStatus(status);
          const color = getStatusColor(status);
          
          return (
            <div key={status} style={{
              flex: '0 0 350px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Column Header */}
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: 'var(--text-main)' }}>{status}</h3>
                {renderDonutChart(columnTasks.length, tasks.length, color)}
              </div>
              
              {/* Table Container */}
              <div style={{ 
                background: '#fff', 
                border: '1px solid var(--card-border)', 
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                minHeight: '400px'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#bfdbfe', borderBottom: '2px solid #3b82f6' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid #93c5fd', width: '30px', color: '#1e3a8a' }}>#</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderRight: '1px solid #93c5fd', color: '#1e3a8a' }}>TASK</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid #93c5fd', width: '60px', color: '#1e3a8a' }}>PERSON</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid #93c5fd', width: '70px', color: '#1e3a8a' }}>PRIORITY</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', width: '60px', color: '#1e3a8a' }}>DAYS REM.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnTasks.map((task, idx) => (
                      <tr key={task.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ padding: '0.5rem', borderRight: '1px solid #e2e8f0', color: 'var(--text-main)', fontWeight: 600 }}>{task.name}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: 'var(--text-muted)' }}>{task.assignee || '-'}</td>
                        <td style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid #e2e8f0' }}>
                          <span style={{ color: getPriorityColor(task.priority), fontWeight: 700, fontSize: '0.75rem' }}>{task.priority || '-'}</span>
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>{calculateDaysRem(task.dueDate)}</td>
                      </tr>
                    ))}
                    {columnTasks.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
