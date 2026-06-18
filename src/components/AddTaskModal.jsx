import React, { useState, useRef, useEffect } from 'react';
import { X, Loader2, ChevronDown } from 'lucide-react';

const SearchableDropdown = ({ options = [], value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        if (value && !options.includes(search)) {
          setSearch(value);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, value, search, options]);

  const filteredOptions = options.filter(opt => opt.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          style={{ 
            width: '100%', padding: '0.8rem 1rem', paddingRight: '2.5rem',
            borderRadius: '10px', border: '1.5px solid var(--card-border)',
            background: 'var(--bg-main)', color: 'var(--text-main)',
            fontFamily: 'inherit', fontSize: '0.95rem'
          }}
        />
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <ChevronDown size={16} />
        </div>
      </div>
      
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px',
          background: '#fff', border: '1px solid var(--card-border)', borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', zIndex: 10,
          maxHeight: '200px', overflowY: 'auto'
        }}>
          {filteredOptions.length > 0 ? filteredOptions.map((opt, idx) => (
            <div 
              key={idx}
              onClick={() => {
                setSearch(opt);
                onChange(opt);
                setIsOpen(false);
              }}
              style={{
                padding: '0.75rem 1rem', cursor: 'pointer', fontSize: '0.9rem',
                borderBottom: idx < filteredOptions.length - 1 ? '1px solid #f1f5f9' : 'none',
                color: 'var(--text-main)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {opt}
            </div>
          )) : (
            <div style={{ padding: '0.75rem 1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Không tìm thấy</div>
          )}
        </div>
      )}
    </div>
  );
};

export default function AddTaskModal({ isOpen, onClose, onSubmit, isSubmitting, settings }) {
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
    
    if (!settings?.projects?.includes(formData.category)) {
      alert("⚠️ Dự án không hợp lệ! Vui lòng chỉ chọn (hoặc gõ đúng) Dự án có sẵn trong danh sách Setting.");
      return;
    }
    if (formData.assignee && !settings?.users?.includes(formData.assignee)) {
      alert("⚠️ Người phụ trách không hợp lệ! Vui lòng chỉ chọn (hoặc gõ đúng) tên có sẵn trong danh sách Setting.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-accent)', fontSize: '1.25rem', color: 'var(--text-main)' }}>Tạo công việc mới</h2>
            <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Vui lòng điền thông tin để thêm task vào Backlog</p>
          </div>
          <button onClick={onClose} style={{ background: 'var(--card-border)', border: 'none', cursor: 'pointer', color: 'var(--text-main)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group full-width">
            <label>Tên công việc (Objective/KR) <span style={{ color: 'var(--danger)' }}>*</span></label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ví dụ: Thiết kế giao diện Dashboard" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dự án <span style={{ color: '#ef4444' }}>*</span></label>
              <SearchableDropdown 
                options={settings?.projects || []}
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                placeholder="Tìm hoặc chọn dự án..."
              />
            </div>
            <div className="form-group">
              <label>Người phụ trách</label>
              <SearchableDropdown 
                options={settings?.users || []}
                value={formData.assignee}
                onChange={(val) => setFormData({ ...formData, assignee: val })}
                placeholder="Tìm người phụ trách..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Độ ưu tiên (Priority)</label>
              <div className="select-wrapper">
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="🚨 Khẩn cấp">🚨 Khẩn cấp</option>
                  <option value="🔥 Cao">🔥 Cao</option>
                  <option value="⚡ Trung bình">⚡ Trung bình</option>
                  <option value="🧊 Thấp">🧊 Thấp</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Trạng thái (Status)</label>
              <div className="select-wrapper">
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
          </div>

          <div className="form-group" style={{ width: '50%' }}>
            <label>Ngày đến hạn (Due Date)</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={isSubmitting} style={{ padding: '0.6rem 1.5rem' }}>Hủy bỏ</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '0.6rem 2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease-out;
        }
        .modal-content {
          background: var(--card-bg);
          width: 90%; max-width: 550px;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid var(--card-border);
          transform: translateY(0);
          animation: slideUp 0.3s ease-out;
        }
        .form-row {
          display: flex; gap: 1.25rem;
        }
        .form-row .form-group {
          flex: 1;
        }
        .form-group {
          display: flex; flexDirection: column; gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.85rem; font-weight: 600; color: var(--text-main);
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 0.8rem 1rem;
          border-radius: 10px;
          border: 1.5px solid var(--card-border);
          background: var(--bg-main);
          color: var(--text-main);
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .form-group input:hover, .form-group select:hover {
          border-color: #cbd5e1;
        }
        .form-group input:focus, .form-group select:focus {
          outline: none; 
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .select-wrapper {
          position: relative;
        }
        .select-wrapper::after {
          content: '▼';
          font-size: 0.6rem;
          color: var(--text-muted);
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }
        .select-wrapper select {
          appearance: none;
          padding-right: 2.5rem;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
