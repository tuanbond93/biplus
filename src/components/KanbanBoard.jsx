import React, { useState } from 'react';
import { getStatusColor, getPriorityColor } from '../helpers';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Trash2 } from 'lucide-react';

export default function KanbanBoard({ tasks, notes = [], onAddNote, onDeleteNote, users = [], onUpdateTaskStatus }) {
  const [filterOwner, setFilterOwner] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');

  // Apply filter
  const filteredTasks = filterOwner ? tasks.filter(t => t.assignee && t.assignee.includes(filterOwner)) : tasks;

  const uniqueStatuses = ['🚦 Chưa bắt đầu', '⏳ Chờ xử lý', '🏃‍♂️ Đang thực hiện', '✅ Hoàn thành'];
  const allStatuses = [...new Set([...uniqueStatuses, ...filteredTasks.map(t => t.status).filter(Boolean)])];

  const getTasksByStatus = (status) => filteredTasks.filter(t => t.status === status);

  const calculateDaysRem = (dueDateStr) => {
    if (!dueDateStr || dueDateStr === '-') return '-';
    const parts = dueDateStr.split('/');
    let targetDate;
    if (parts.length === 3) targetDate = new Date(parts[2], parts[1] - 1, parts[0]);
    else targetDate = new Date(dueDateStr);
    
    if (isNaN(targetDate.getTime())) return dueDateStr; 
    
    const diffTime = targetDate - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('');

  const handlePostNote = () => {
    if (!newNoteText.trim()) return;
    onAddNote({ text: newNoteText, author: newNoteAuthor || 'Anonymous' });
    setNewNoteText('');
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setUpdateStatus(task.status);
  };

  const handleUpdateStatus = () => {
    if (selectedTask && updateStatus !== selectedTask.status) {
      onUpdateTaskStatus(selectedTask.name, updateStatus);
      setSelectedTask(prev => ({ ...prev, status: updateStatus }));
      alert(`Đã cập nhật trạng thái thành: ${updateStatus}`);
    }
  };

  const renderDonutChart = (columnTasksCount, totalTasksCount, color) => {
    const percentage = totalTasksCount > 0 ? (columnTasksCount / totalTasksCount) * 100 : 0;
    const data = [{ name: 'Tasks', value: percentage, fill: color }];

    return (
      <div style={{ width: '120px', height: '120px', position: 'relative', margin: '0 auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={12} data={data} startAngle={90} endAngle={-270}>
            <RadialBar background={{ fill: 'var(--card-border)' }} dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: '100%' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{columnTasksCount}</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Tasks</div>
        </div>
      </div>
    );
  };

  return (
    <div className="kanban-layout">
      {/* LEFT SIDEBAR (Filter, Updater, Notes) */}
      <div className="kanban-sidebar">
        
        {/* FILTER BY */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>FILTER BY</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ color: '#3b82f6', fontWeight: 700, display: 'flex', alignItems: 'center' }}>OWNER</div>
            <div>
              <select 
                value={filterOwner} 
                onChange={e => setFilterOwner(e.target.value)} 
                style={{ width: '100%', padding: '0.2rem 0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              >
                <option value="">Tất cả</option>
                {users.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* TASK UPDATER */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>TASK UPDATER</h4>
          
          {!selectedTask ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
              Bấm vào 1 task bên phải để xem và cập nhật
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ color: '#ef4444', fontWeight: 700 }}>TASK</div>
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={selectedTask.name}>{selectedTask.name}</div>
              
              <div style={{ color: '#ef4444', fontWeight: 700 }}>DUE DATE</div>
              <div>{selectedTask.dueDate}</div>
              
              <div style={{ color: '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center' }}>STATUS</div>
              <div>
                <select 
                  value={updateStatus} 
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.2rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.75rem' }}
                >
                  <option value="🚦 Chưa bắt đầu">🚦 Chưa bắt đầu</option>
                  <option value="⏳ Chờ xử lý">⏳ Chờ xử lý</option>
                  <option value="🏃‍♂️ Đang thực hiện">🏃‍♂️ Đang thực hiện</option>
                  <option value="⏸️ Tạm hoãn">⏸️ Tạm hoãn</option>
                  <option value="🐢 Bị chậm trễ">🐢 Bị chậm trễ</option>
                  <option value="✅ Hoàn thành">✅ Hoàn thành</option>
                  <option value="❌ Đã hủy">❌ Đã hủy</option>
                </select>
              </div>
              
              <div style={{ color: '#ef4444', fontWeight: 700 }}>PRIORITY</div>
              <div><span style={{ color: getPriorityColor(selectedTask.priority), fontWeight: 700 }}>{selectedTask.priority}</span></div>
              
              <div style={{ color: '#ef4444', fontWeight: 700 }}>OWNER</div>
              <div>{selectedTask.assignee}</div>
              
              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
                <button 
                  onClick={handleUpdateStatus}
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', borderRadius: '4px' }}
                >
                  Xác nhận Update
                </button>
              </div>
            </div>
          )}
        </div>

        {/* NOTES */}
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>NOTES</h4>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', marginBottom: '1rem', maxHeight: '200px' }}>
            {notes.map(note => (
              <div key={note.id} style={{ background: '#fef08a', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid #facc15', position: 'relative' }}>
                <p style={{ margin: '0 0 0.25rem 0', color: '#422006' }}>{note.text}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#854d0e', fontWeight: 600 }}>- {note.author}</span>
                  <button onClick={() => onDeleteNote(note.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: '#ca8a04' }} title="Xóa note"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
            {notes.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Không có ghi chú nào.</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <textarea value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} placeholder="Nhập ghi chú..." style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--card-border)', background: 'var(--bg-color)', color: 'var(--text-main)', borderRadius: '4px', fontSize: '0.8rem', resize: 'vertical', minHeight: '60px' }} />
            <select value={newNoteAuthor} onChange={(e) => setNewNoteAuthor(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--card-border)', background: 'var(--bg-color)', color: 'var(--text-main)', borderRadius: '4px', fontSize: '0.8rem' }}>
              <option value="">-- Chọn người note --</option>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <button onClick={handlePostNote} style={{ background: 'var(--primary)', color: 'var(--text-main)', border: 'none', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              + Post Note
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT BOARD (Kanban Columns) */}
      <div className="kanban-board-container">
        {allStatuses.map(status => {
          const columnTasks = getTasksByStatus(status);
          const color = getStatusColor(status);
          
          return (
            <div key={status} style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1rem', margin: '0 0 1rem 0', color: 'var(--text-main)' }}>{status}</h3>
                {renderDonutChart(columnTasks.length, tasks.length, color)}
              </div>
              
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', minHeight: '400px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: color + '15', borderBottom: `2px solid ${color}` }}>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderRight: `1px solid ${color}40`, width: '30px', color: 'var(--text-main)' }}>#</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderRight: `1px solid ${color}40`, color: 'var(--text-main)' }}>TASK</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderRight: `1px solid ${color}40`, width: '60px', color: 'var(--text-main)' }}>PERSON</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderRight: `1px solid ${color}40`, width: '70px', color: 'var(--text-main)' }}>PRIORITY</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', width: '60px', color: 'var(--text-main)' }}>DAYS REM.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnTasks.map((task, idx) => (
                      <tr 
                        key={task.id} 
                        onClick={() => handleTaskClick(task)}
                        style={{ 
                          borderBottom: '1px solid var(--card-border)', 
                          cursor: 'pointer',
                          background: selectedTask?.id === task.id ? color + '15' : 'var(--card-bg)',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = selectedTask?.id === task.id ? color + '15' : 'var(--bg-color)'}
                        onMouseLeave={e => e.currentTarget.style.background = selectedTask?.id === task.id ? color + '15' : 'var(--card-bg)'}
                      >
                        <td style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ padding: '0.5rem', borderRight: '1px solid var(--card-border)' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700, marginBottom: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '150px' }} title={task.goal ? `${task.goal} ➔ ${task.category}` : task.category}>
                            {task.goal ? `${task.goal} ➔ ` : ''}{task.category && task.category !== 'No Project' ? task.category : ''}
                          </div>
                          <div style={{ color: 'var(--text-main)', fontWeight: 600 }}>{task.name}</div>
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid var(--card-border)', color: 'var(--text-main)' }}>
                          {task.assignee ? task.assignee.split(',').map(name => name.trim().charAt(0)).join('') : '-'}
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center', borderRight: '1px solid var(--card-border)', color: 'var(--text-main)' }}>
                          <span style={{ color: getPriorityColor(task.priority), fontWeight: 700, fontSize: '0.75rem' }}>{task.priority || '-'}</span>
                        </td>
                        <td style={{ padding: '0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>{calculateDaysRem(task.dueDate)}</td>
                      </tr>
                    ))}
                    {columnTasks.length === 0 && (
                      <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No tasks</td></tr>
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
