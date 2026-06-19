import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend
} from 'recharts';
import { CheckCircle, Clock, AlertCircle, ListTodo, Edit, Calendar, User, Layout } from 'lucide-react';
import { getStatusColor } from '../helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel" style={{ padding: '10px', background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        {label && <p style={{ color: 'var(--text-main)', marginBottom: '5px', fontWeight: 600 }}>{label}</p>}
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.payload.fill, fontSize: '14px', margin: '2px 0' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ tasks }) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 1. Calculate Summary Stats
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status && (t.status.toLowerCase().includes('hoàn thành') || t.status.toLowerCase().includes('done'))).length;
  
  // Custom logic for Outstanding / Overdue / Due in 3 / 7 days
  const activeTasksList = tasks.filter(t => t.status && !t.status.toLowerCase().includes('hoàn thành') && !t.status.toLowerCase().includes('hủy'));
  const outstanding = activeTasksList.length;
  
  let overdue = 0;
  let dueIn3Days = 0;
  let dueIn7Days = 0;
  
  let completed7d = 0;
  let updated7d = 0;
  let created7d = 0;
  let dueSoon7d = 0;

  tasks.forEach(t => {
    // Dates parsing
    const cDate = new Date(t.createdDate);
    if (!isNaN(cDate) && cDate >= sevenDaysAgo) created7d++;
    
    const uDate = new Date(t.updatedDate);
    if (!isNaN(uDate) && uDate >= sevenDaysAgo) {
      updated7d++;
      if (t.status && (t.status.toLowerCase().includes('hoàn thành') || t.status.toLowerCase().includes('done'))) {
        completed7d++;
      }
    }

    if (t.dueDate && t.dueDate !== '-') {
      // Assuming dueDate format is YYYY-MM-DD
      const parts = t.dueDate.split('-');
      if (parts.length === 3) {
        const dDate = new Date(parts[0], parts[1] - 1, parts[2]);
        if (!isNaN(dDate)) {
          if (dDate < now && !t.status.toLowerCase().includes('hoàn thành')) overdue++;
          
          const diffDays = Math.ceil((dDate - now) / (1000 * 60 * 60 * 24));
          if (diffDays >= 0 && diffDays <= 3 && !t.status.toLowerCase().includes('hoàn thành')) dueIn3Days++;
          if (diffDays >= 0 && diffDays <= 7 && !t.status.toLowerCase().includes('hoàn thành')) {
             dueIn7Days++;
             dueSoon7d++;
          }
        }
      }
    }
  });

  // 2. Data for Status Donut Chart
  const statusCounts = {};
  tasks.forEach(t => {
    const s = t.status || 'Unknown';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });
  const statusData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key],
    fill: getStatusColor(key)
  })).sort((a,b) => b.value - a.value);

  // 3. Team Workload
  const ownerStatsMap = {};
  let totalAssignedTasks = 0;
  tasks.forEach(task => {
    if (!task.assignee) {
      ownerStatsMap['Unassigned'] = (ownerStatsMap['Unassigned'] || 0) + 1;
      totalAssignedTasks++;
      return;
    }
    const assignees = task.assignee.split(',').map(a => a.trim()).filter(Boolean);
    assignees.forEach(assignee => {
      ownerStatsMap[assignee] = (ownerStatsMap[assignee] || 0) + 1;
      totalAssignedTasks++;
    });
  });
  
  const teamWorkload = Object.keys(ownerStatsMap).map(name => ({
    name,
    count: ownerStatsMap[name],
    percent: totalAssignedTasks > 0 ? Math.round((ownerStatsMap[name] / totalAssignedTasks) * 100) : 0
  })).sort((a,b) => b.count - a.count);

  // 4. Project Progress
  const projectStatsMap = {};
  tasks.forEach(task => {
    const proj = task.category || 'No Project';
    if (!projectStatsMap[proj]) {
      projectStatsMap[proj] = { name: proj, done: 0, inProgress: 0, todo: 0, total: 0 };
    }
    projectStatsMap[proj].total++;
    const s = (task.status || '').toLowerCase();
    if (s.includes('hoàn thành') || s.includes('done')) projectStatsMap[proj].done++;
    else if (s.includes('đang') || s.includes('chờ') || s.includes('progress')) projectStatsMap[proj].inProgress++;
    else projectStatsMap[proj].todo++;
  });
  
  const projectProgress = Object.values(projectStatsMap).map(p => {
    return {
      ...p,
      donePct: p.total > 0 ? Math.round((p.done / p.total) * 100) : 0,
      inProgressPct: p.total > 0 ? Math.round((p.inProgress / p.total) * 100) : 0,
      todoPct: p.total > 0 ? Math.round((p.todo / p.total) * 100) : 0,
    };
  }).sort((a,b) => b.total - a.total);

  return (
    <div className="dashboard" style={{ paddingBottom: '3rem' }}>
      
      {/* 1. Summary Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', padding: '1.5rem', background: 'var(--card-bg)', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--card-border)' }}>
        <h3 style={{ width: '100%', textAlign: 'center', margin: '0 0 1rem 0', color: 'var(--text-main)', fontSize: '1rem', letterSpacing: '1px' }}>SUMMARY</h3>
        
        <div className="summary-pill" style={{ background: '#333333', color: 'white' }}>
          <div className="pill-icon" style={{ background: 'rgba(255,255,255,0.15)' }}><ListTodo size={18} /></div>
          <div>
            <div className="pill-title">Total Tasks</div>
            <div className="pill-value">{totalTasks}</div>
          </div>
        </div>
        
        <div className="summary-pill" style={{ background: '#c0d72f', color: '#333' }}>
          <div className="pill-icon" style={{ background: 'rgba(0,0,0,0.1)' }}><CheckCircle size={18} /></div>
          <div>
            <div className="pill-title">Completed</div>
            <div className="pill-value">{doneTasks}</div>
          </div>
        </div>

        <div className="summary-pill" style={{ background: '#f47c98', color: 'white' }}>
          <div className="pill-icon" style={{ background: 'rgba(255,255,255,0.15)' }}><Clock size={18} /></div>
          <div>
            <div className="pill-title">Outstanding</div>
            <div className="pill-value">{outstanding}</div>
          </div>
        </div>

        <div className="summary-pill" style={{ background: '#f8b4c4', color: '#333' }}>
          <div className="pill-icon" style={{ background: 'rgba(0,0,0,0.1)' }}><AlertCircle size={18} /></div>
          <div>
            <div className="pill-title">Overdue</div>
            <div className="pill-value">{overdue}</div>
          </div>
        </div>

        <div className="summary-pill" style={{ background: '#9eb4e5', color: '#333' }}>
          <div className="pill-icon" style={{ background: 'rgba(0,0,0,0.1)' }}><Calendar size={18} /></div>
          <div>
            <div className="pill-title">Due in 3 Days</div>
            <div className="pill-value">{dueIn3Days}</div>
          </div>
        </div>

        <div className="summary-pill" style={{ background: '#b29dd6', color: '#333' }}>
          <div className="pill-icon" style={{ background: 'rgba(0,0,0,0.1)' }}><Calendar size={18} /></div>
          <div>
            <div className="pill-title">Due in 7 Days</div>
            <div className="pill-value">{dueIn7Days}</div>
          </div>
        </div>
      </div>

      {/* 2. Recent Activity Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="activity-card glass-card">
          <div className="ac-icon" style={{ background: 'var(--bg-color)' }}><CheckCircle size={20} /></div>
          <div>
            <div className="ac-title"><b>{completed7d}</b> completed</div>
            <div className="ac-subtitle">in the last 7 days</div>
          </div>
        </div>
        <div className="activity-card glass-card">
          <div className="ac-icon" style={{ background: 'var(--bg-color)' }}><Edit size={20} /></div>
          <div>
            <div className="ac-title"><b>{updated7d}</b> updated</div>
            <div className="ac-subtitle">in the last 7 days</div>
          </div>
        </div>
        <div className="activity-card glass-card">
          <div className="ac-icon" style={{ background: 'var(--bg-color)' }}><Layout size={20} /></div>
          <div>
            <div className="ac-title"><b>{created7d}</b> created</div>
            <div className="ac-subtitle">in the last 7 days</div>
          </div>
        </div>
        <div className="activity-card glass-card">
          <div className="ac-icon" style={{ background: 'var(--bg-color)' }}><Calendar size={20} /></div>
          <div>
            <div className="ac-title"><b>{dueSoon7d}</b> due soon</div>
            <div className="ac-subtitle">in the next 7 days</div>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Status overview */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Status overview</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Get a snapshot of the status of your work items.</p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flex: 1 }}>
            <div style={{ width: '220px', height: '220px', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {statusData.length > 0 ? Math.round((statusData[0].value / totalTasks) * 100) : 0}%
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{statusData.length > 0 ? statusData[0].name : 'To Do'}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {statusData.map((s, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  <span style={{ width: '12px', height: '12px', background: s.fill, borderRadius: '2px' }}></span>
                  {s.name}: {s.value}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team workload */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Team workload</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Monitor the capacity of your team.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto', maxHeight: '300px', paddingRight: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
              <span>Assignee</span>
              <span>Work distribution</span>
            </div>
            
            {teamWorkload.map((user, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '150px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem' }}>
                    <User size={14} />
                  </div>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
                </div>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', width: '35px' }}>{user.percent}%</span>
                  <div style={{ flex: 1, height: '16px', background: 'var(--bg-color)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${user.percent}%`, height: '100%', background: '#8492a6' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Project progress */}
      <div className="glass-card" style={{ width: '100%' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Project progress</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>See how your projects are progressing at a glance.</p>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '12px', height: '12px', background: '#69b036', borderRadius: '2px' }}></span> Done</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '2px' }}></span> In progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><span style={{ width: '12px', height: '12px', background: '#8492a6', borderRadius: '2px' }}></span> To do</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {projectProgress.map((proj, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>
                <span style={{ color: '#b29dd6' }}>⚡</span> {proj.name}
              </div>
              <div style={{ width: '100%', height: '24px', background: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                {proj.donePct > 0 && (
                  <div style={{ width: `${proj.donePct}%`, background: '#69b036', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                    {proj.donePct}%
                  </div>
                )}
                {proj.inProgressPct > 0 && (
                  <div style={{ width: `${proj.inProgressPct}%`, background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                    {proj.inProgressPct}%
                  </div>
                )}
                {proj.todoPct > 0 && (
                  <div style={{ width: `${proj.todoPct}%`, background: '#8492a6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>
                    {proj.todoPct}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
