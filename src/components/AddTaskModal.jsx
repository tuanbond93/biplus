import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function AddTaskModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    assignee: '',
    priority: '🧊 Thấp',
    status: '🚦 Chưa bắt đầu',
    dueDate: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-accent)' }}>Tạo công việc mới (Add Task)</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label>Tên công việc (Objective/KR) *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nhập tên công việc..." />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Project (Category)</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="VD: BiPlus Portal" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Người phụ trách (Owner)</label>
              <input type="text" name="assignee" value={formData.assignee} onChange={handleChange} placeholder="VD: Thu" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Độ ưu tiên (Priority)</label>
              <select name="priority" value={formData.priority} onChange={handleChange}>
                <option value="🚨 Khẩn cấp">🚨 Khẩn cấp</option>
                <option value="🔥 Cao">🔥 Cao</option>
                <option value="⚡ Trung bình">⚡ Trung bình</option>
                <option value="🧊 Thấp">🧊 Thấp</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Trạng thái (Status)</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="🚦 Chưa bắt đầu">🚦 Chưa bắt đầu</option>
                <option value="⏳ Chờ xử lý">⏳ Chờ xử lý</option>
                <option value="🏃‍♂️ Đang thực hiện">🏃‍♂️ Đang thực hiện</option>
                <option value="⏸️ Tạm hoãn">⏸️ Tạm hoãn</option>
                <option value="🐢 Bị chậm trễ">🐢 Bị chậm trễ</option>
                <option value="✅ Hoàn thành">✅ Hoàn thành</option>
                <option value="❌ Đã hủy">❌ Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Ngày đến hạn (Due Date)</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting}>Hủy</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {isSubmitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {isSubmitting ? 'Đang lưu...' : 'Lưu Task'}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
        }
        .modal-content {
          background: var(--card-bg);
          width: 90%; max-width: 500px;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          border: 1px solid var(--card-border);
        }
        .form-group {
          display: flex; flexDirection: column; gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.875rem; font-weight: 600; color: var(--text-main);
        }
        .form-group input, .form-group select {
          padding: 0.75rem;
          border-radius: 8px;
          border: 1px solid var(--card-border);
          background: var(--bg-main);
          color: var(--text-main);
          font-family: inherit;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none; border-color: var(--primary);
        }
      `}</style>
    </div>
  );
}
