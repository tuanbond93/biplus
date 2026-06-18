export const STATUSES = [
  '🚦 Chưa bắt đầu',
  '⏳ Chờ xử lý',
  '🏃‍♂️ Đang thực hiện',
  '⏸️ Tạm hoãn',
  '🐢 Bị chậm trễ',
  '✅ Hoàn thành',
  '❌ Đã hủy'
];

export const PRIORITIES = [
  '🚨 Khẩn cấp',
  '🔥 Cao',
  '⚡ Trung bình',
  '🧊 Thấp'
];

export const STATUS_COLORS = {
  '🚦 Chưa bắt đầu': '#94a3b8',
  '⏳ Chờ xử lý': '#fcd34d',
  '🏃‍♂️ Đang thực hiện': '#3b82f6',
  '⏸️ Tạm hoãn': '#8b5cf6',
  '🐢 Bị chậm trễ': '#ef4444',
  '✅ Hoàn thành': '#10b981',
  '❌ Đã hủy': '#64748b'
};

export const COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#0ea5e9',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f97316'
};

export const mockTasks = [
  {
    id: 'TASK-001',
    name: 'Thiết kế giao diện Dashboard',
    assignee: 'Thu',
    status: '✅ Hoàn thành',
    priority: '🔥 Cao',
    category: 'Project A',
    progress: 100,
    startDate: '2026-06-10',
    dueDate: '2026-06-15',
    estTime: 10,
    actualTime: 9.5
  },
  {
    id: 'TASK-002',
    name: 'Tạo API Get List Tasks',
    assignee: 'Nam',
    status: '🏃‍♂️ Đang thực hiện',
    priority: '⚡ Trung bình',
    category: 'Project B',
    progress: 60,
    startDate: '2026-06-14',
    dueDate: '2026-06-20',
    estTime: 8,
    actualTime: 5
  },
  {
    id: 'TASK-003',
    name: 'Viết unit test cho API',
    assignee: 'Thu',
    status: '🚦 Chưa bắt đầu',
    priority: '🧊 Thấp',
    category: 'Project A',
    progress: 0,
    startDate: '2026-06-18',
    dueDate: '2026-06-22',
    estTime: 4,
    actualTime: 0
  },
  {
    id: 'TASK-004',
    name: 'Fix bug đăng nhập khẩn cấp',
    assignee: 'Hoàng',
    status: '⏳ Chờ xử lý',
    priority: '🚨 Khẩn cấp',
    category: 'Project A',
    progress: 90,
    startDate: '2026-06-17',
    dueDate: '2026-06-18',
    estTime: 2,
    actualTime: 2.5
  },
  {
    id: 'TASK-005',
    name: 'Tối ưu hiệu năng Database',
    assignee: 'Nam',
    status: '⏸️ Tạm hoãn',
    priority: '🔥 Cao',
    category: 'Project B',
    progress: 30,
    startDate: '2026-06-20',
    dueDate: '2026-06-25',
    estTime: 12,
    actualTime: 4
  },
  {
    id: 'TASK-006',
    name: 'Cập nhật tài liệu kỹ thuật',
    assignee: 'Thu',
    status: '✅ Hoàn thành',
    priority: '⚡ Trung bình',
    category: 'Project A',
    progress: 100,
    startDate: '2026-06-01',
    dueDate: '2026-06-05',
    estTime: 5,
    actualTime: 5
  },
  {
    id: 'TASK-007',
    name: 'Triển khai lên môi trường Staging',
    assignee: 'Hoàng',
    status: '🐢 Bị chậm trễ',
    priority: '🔥 Cao',
    category: 'Project C',
    progress: 40,
    startDate: '2026-06-16',
    dueDate: '2026-06-19',
    estTime: 6,
    actualTime: 8
  },
  {
    id: 'TASK-008',
    name: 'Tích hợp Google Sheets API',
    assignee: 'Thu',
    status: '🏃‍♂️ Đang thực hiện',
    priority: '⚡ Trung bình',
    category: 'Project A',
    progress: 30,
    startDate: '2026-06-18',
    dueDate: '2026-06-24',
    estTime: 20,
    actualTime: 6
  },
  {
    id: 'TASK-009',
    name: 'Thiết lập CI/CD pipeline',
    assignee: 'Hoàng',
    status: '❌ Đã hủy',
    priority: '🔥 Cao',
    category: 'Project B',
    progress: 10,
    startDate: '2026-06-05',
    dueDate: '2026-06-10',
    estTime: 16,
    actualTime: 2
  },
  {
    id: 'TASK-010',
    name: 'Họp Review Sprint 1',
    assignee: 'Thu',
    status: '✅ Hoàn thành',
    priority: '🧊 Thấp',
    category: 'Project A',
    progress: 100,
    startDate: '2026-06-12',
    dueDate: '2026-06-12',
    estTime: 1.5,
    actualTime: 1.5
  }
];
