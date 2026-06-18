export const getStatusColor = (status) => {
  if (!status) return '#94a3b8';
  const s = status.toLowerCase();
  if (s.includes('chưa') || s.includes('todo') || s.includes('new')) return '#cbd5e1'; // Gray
  if (s.includes('đang') || s.includes('doing') || s.includes('progress') || s.includes('chờ')) return '#3b82f6'; // Blue
  if (s.includes('hoàn thành') || s.includes('done') || s.includes('finish') || s.includes('✅')) return '#10b981'; // Green
  if (s.includes('trễ') || s.includes('chậm') || s.includes('overdue')) return '#ef4444'; // Red
  if (s.includes('hoãn') || s.includes('pause')) return '#f59e0b'; // Amber
  if (s.includes('hủy') || s.includes('cancel')) return '#64748b'; // Slate
  
  // Deterministic color based on string hash for unknown statuses
  const colors = ['#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'];
  let hash = 0;
  for (let i = 0; i < status.length; i++) hash = status.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

export const getPriorityColor = (priority) => {
  if (!priority) return '#94a3b8';
  const p = priority.toLowerCase();
  if (p.includes('khẩn') || p.includes('urgent') || p.includes('🚨')) return '#ef4444'; // Red
  if (p.includes('cao') || p.includes('high') || p.includes('🔥')) return '#f97316'; // Orange
  if (p.includes('trung bình') || p.includes('medium') || p.includes('⚡')) return '#3b82f6'; // Blue
  if (p.includes('thấp') || p.includes('low') || p.includes('🧊')) return '#94a3b8'; // Gray
  return '#64748b';
};
