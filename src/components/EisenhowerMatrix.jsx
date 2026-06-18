import React, { useState } from 'react';
import { getPriorityColor } from '../helpers';
import { Trash2 } from 'lucide-react';

export default function EisenhowerMatrix({ tasks, notes = [], onAddNote, onDeleteNote, users = [] }) {
  const doFirst = tasks.filter(t => t.priority && (t.priority.toLowerCase().includes('khẩn') || t.priority.toLowerCase().includes('urgent')));
  const schedule = tasks.filter(t => t.priority && (t.priority.toLowerCase().includes('cao') || t.priority.toLowerCase().includes('high')));
  const delegate = tasks.filter(t => t.priority && (t.priority.toLowerCase().includes('trung bình') || t.priority.toLowerCase().includes('medium')));
  const dontDo = tasks.filter(t => t.priority && (t.priority.toLowerCase().includes('thấp') || t.priority.toLowerCase().includes('low')));

  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('');

  const handlePostNote = () => {
    if (!newNoteText.trim()) return;
    onAddNote({ text: newNoteText, author: newNoteAuthor || 'Anonymous' });
    setNewNoteText('');
  };

  const renderQuadrant = (title, list, color, bgColor) => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', border: `1px solid ${color}40`, borderRadius: '12px', overflow: 'hidden' }}>
      <div style={{ background: bgColor, padding: '1rem', borderBottom: `1px solid ${color}40` }}>
        <h3 style={{ margin: 0, color: color, fontSize: '1.1rem', display: 'flex', justifyContent: 'space-between' }}>
          {title}
          <span style={{ background: '#fff', padding: '0.1rem 0.5rem', borderRadius: '99px', fontSize: '0.8rem' }}>{list.length}</span>
        </h3>
      </div>
      <div style={{ padding: '1rem', flex: 1, overflowY: 'auto', maxHeight: '400px', display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#f8fafc' }}>
        {list.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '2rem' }}>Không có công việc nào</div>
        ) : (
          list.map(task => (
            <div key={task.id} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid var(--card-border)', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>{task.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Dự án: {task.category || '-'}</span>
                <span>👤 {task.assignee || '-'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
      {/* LEFT SIDEBAR (Filter, Updater, Notes) */}
      <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
        
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
            <div style={{ color: '#ef4444', fontWeight: 700 }}>TASK</div><div>-</div>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>DUE DATE</div><div>-</div>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>STATUS</div><div style={{ fontSize: '0.75rem' }}>🏃‍♂️ Đang thực hiện</div>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>PRIORITY</div><div>-</div>
            <div style={{ color: '#ef4444', fontWeight: 700 }}>OWNER</div><div>-</div>
            <div style={{ color: '#10b981', fontWeight: 700, marginTop: '0.5rem' }}>Update?</div><div style={{ marginTop: '0.5rem' }}><input type="checkbox" /></div>
          </div>
        </div>

        {/* NOTES */}
        <div style={{ background: '#fff', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h4 style={{ textAlign: 'center', margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>NOTES</h4>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', marginBottom: '1rem', maxHeight: '200px' }}>
            {notes.map(note => (
              <div key={note.id} style={{ background: '#fef08a', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', borderLeft: '3px solid #facc15', position: 'relative' }}>
                <p style={{ margin: '0 0 0.25rem 0', color: '#422006' }}>{note.text}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', color: '#854d0e', fontWeight: 600 }}>- {note.author}</span>
                  <button onClick={() => onDeleteNote(note.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#b45309', padding: 0 }}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
            {notes.length === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>Không có ghi chú nào.</p>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <textarea value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} placeholder="Nhập ghi chú..." style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.8rem', resize: 'vertical', minHeight: '60px' }} />
            <select value={newNoteAuthor} onChange={(e) => setNewNoteAuthor(e.target.value)} style={{ width: '100%', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.8rem' }}>
              <option value="">-- Chọn người note --</option>
              {users.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <button onClick={handlePostNote} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              + Post Note
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT BOARD (Matrix) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
          {renderQuadrant('🚨 DO FIRST (Khẩn cấp)', doFirst, '#ef4444', '#fef2f2')}
          {renderQuadrant('🔥 SCHEDULE (Cao)', schedule, '#f97316', '#fff7ed')}
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
          {renderQuadrant('⚡ DELEGATE (TB)', delegate, '#3b82f6', '#eff6ff')}
          {renderQuadrant('🧊 DONT DO (Thấp)', dontDo, '#94a3b8', '#f8fafc')}
        </div>
      </div>
      
    </div>
  );
}
