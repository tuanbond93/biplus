import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';
import { CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { getStatusColor } from '../helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel" style={{ padding: '10px', background: 'var(--card-bg)' }}>
        <p style={{ color: 'var(--text-main)', marginBottom: '5px', fontWeight: 600 }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color, fontSize: '14px', margin: '2px 0' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ tasks }) {
  const uniqueStatuses = [...new Set(tasks.map(t => t.status).filter(Boolean))];

  // 1. Calculate Summary Stats
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status && (t.status.toLowerCase().includes('hoàn thành') || t.status.toLowerCase().includes('done'))).length;
  const activeTasks = tasks.filter(t => t.status && (t.status.toLowerCase().includes('đang') || t.status.toLowerCase().includes('chờ') || t.status.toLowerCase().includes('progress'))).length;
  const overdueTasks = tasks.filter(t => t.status && (t.status.toLowerCase().includes('trễ') || t.status.toLowerCase().includes('chậm') || t.status.toLowerCase().includes('overdue'))).length;

  // 2. Data for Owner x Status Chart
  const ownerStatsMap = {};
  tasks.forEach(task => {
    if (!task.assignee) return;
    const assignees = task.assignee.split(',').map(a => a.trim()).filter(Boolean);
    assignees.forEach(assignee => {
      if (!ownerStatsMap[assignee]) {
        ownerStatsMap[assignee] = { name: assignee };
        uniqueStatuses.forEach(s => ownerStatsMap[assignee][s] = 0);
      }
      ownerStatsMap[assignee][task.status] += 1;
    });
  });
  const ownerData = Object.values(ownerStatsMap);

  // 3. Data for Category x Status Chart
  const categoryStatsMap = {};
  tasks.forEach(task => {
    if (!task.category) return;
    if (!categoryStatsMap[task.category]) {
      categoryStatsMap[task.category] = { name: task.category };
      uniqueStatuses.forEach(s => categoryStatsMap[task.category][s] = 0);
    }
    categoryStatsMap[task.category][task.status] += 1;
  });
  const categoryData = Object.values(categoryStatsMap);

  // 4. Data for DoD Progress (Average progress across all tasks)
  const avgProgress = totalTasks > 0 
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / totalTasks) 
    : 0;
    
  const progressData = [{ name: 'DoD Progress', value: avgProgress, fill: getStatusColor('Hoàn thành') }];

  return (
    <div className="dashboard">
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)', fontFamily: 'var(--font-accent)' }}>Overview Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', color: '#3b82f6' }}>
            <ListTodo size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Tổng Task</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-main)' }}>{totalTasks}</h3>
          </div>
        </div>
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Hoàn thành</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-main)' }}>{doneTasks}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px', color: '#3b82f6' }}>
            <Clock size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Đang làm / Chờ</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-main)' }}>{activeTasks}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '12px', color: '#ef4444' }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Chậm trễ</p>
            <h3 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--text-main)' }}>{overdueTasks}</h3>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Owner x Status Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Tasks theo Người phụ trách</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ownerData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                {uniqueStatuses.map(s => <Bar key={s} dataKey={s} stackId="a" fill={getStatusColor(s)} />)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project x Status Chart */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-main)' }}>Tasks theo Project/Category</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--text-muted)" tick={{fill: 'var(--text-muted)'}} axisLine={false} tickLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                {uniqueStatuses.map(s => <Bar key={s} dataKey={s} stackId="a" fill={getStatusColor(s)} />)}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DoD Progress Chart */}
        <div className="glass-card" style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Mục tiêu DoD (Definition of Done) Progress</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', height: 250 }}>
            <div style={{ width: 250, height: 250, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" 
                  barSize={20} data={progressData} startAngle={90} endAngle={-270}
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar background={{ fill: 'var(--card-border)' }} dataKey="value" cornerRadius={10} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)', textAlign: 'center' 
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{avgProgress}%</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Overall DoD</div>
              </div>
            </div>
            
            <div style={{ maxWidth: 300 }}>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                Biểu đồ này đo lường tỷ lệ hoàn thành trung bình của tất cả các công việc trong hệ thống so với tiêu chuẩn DoD.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600 }}>Hoàn thành (100%)</span>
                  <span style={{ fontWeight: 700, color: getStatusColor('Hoàn thành') }}>{doneTasks} tasks</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${(doneTasks/totalTasks)*100}%`, background: getStatusColor('Hoàn thành') }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
