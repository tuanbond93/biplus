import React, { useState, useMemo } from 'react';
import { getStatusColor, getPriorityColor } from '../helpers';
import { Trash2, Search, ChevronDown, ChevronRight, Target, Folder, CheckSquare } from 'lucide-react';

export default function TaskTable({ tasks, onDeleteTask, onEditTask }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGoals, setExpandedGoals] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    return (
      <span style={{
        background: `${color}15`, color: color, padding: '0.25rem 0.75rem',
        borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap'
      }}>
        <span style={{width: '6px', height: '6px', borderRadius: '50%', background: color, marginRight: '6px'}}></span>
        {status}
      </span>
    );
  };

  const filteredTasks = tasks.filter(t => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    return (t.name || '').toLowerCase().includes(lowerQ) || 
           (t.category || '').toLowerCase().includes(lowerQ) ||
           (t.goal || '').toLowerCase().includes(lowerQ) ||
           (t.assignee || '').toLowerCase().includes(lowerQ);
  });

  // Grouping logic: Goal -> Project -> Tasks
  const groupedData = useMemo(() => {
    const groups = {};
    filteredTasks.forEach(task => {
      const goal = task.goal || 'No Goal (Company Objectives)';
      const project = task.category || 'No Project';
      
      if (!groups[goal]) groups[goal] = { name: goal, projects: {} };
      if (!groups[goal].projects[project]) groups[goal].projects[project] = { name: project, tasks: [] };
      
      groups[goal].projects[project].tasks.push(task);
    });
    return groups;
  }, [filteredTasks]);

  const toggleGoal = (goal) => setExpandedGoals(prev => ({...prev, [goal]: !prev[goal]}));
  const toggleProject = (goal, project) => setExpandedProjects(prev => ({...prev, [`${goal}-${project}`]: !prev[`${goal}-${project}`]}));

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-accent)', fontSize: '1.1rem', color: 'var(--text-main)' }}>Backlog Hierarchy</h3>
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo Goal, Project, Task..." 
            style={{ 
              width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', 
              borderRadius: '8px', border: '1px solid var(--card-border)',
              background: 'var(--bg-color)', color: 'var(--text-main)', outline: 'none'
            }}
          />
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-color)', borderBottom: '2px solid var(--card-border)' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Priority</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Due Date / Week</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Owner</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>Points</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(groupedData).map((goalGroup) => {
              const goalKey = goalGroup.name;
              const isGoalExpanded = expandedGoals[goalKey] !== false; // default expanded
              
              return (
                <React.Fragment key={goalKey}>
                  {/* LEVEL 1: GOAL */}
                  <tr 
                    onClick={() => toggleGoal(goalKey)}
                    style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-light)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--card-bg)'}
                  >
                    <td colSpan="7" style={{ padding: '0.75rem 1.5rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {isGoalExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      <Target size={18} color="var(--primary)" />
                      {goalKey}
                    </td>
                  </tr>

                  {/* LEVEL 2: PROJECT */}
                  {isGoalExpanded && Object.values(goalGroup.projects).map((projGroup) => {
                    const projKey = projGroup.name;
                    const isProjExpanded = expandedProjects[`${goalKey}-${projKey}`] !== false; // default expanded
                    
                    return (
                      <React.Fragment key={projKey}>
                        <tr 
                          onClick={() => toggleProject(goalKey, projKey)}
                          style={{ background: '#f8fafc', borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                          onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                        >
                          <td colSpan="7" style={{ padding: '0.6rem 1.5rem 0.6rem 3rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#94a3b8' }}>└──</span>
                            {isProjExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <Folder size={16} color="#3b82f6" />
                            {projKey}
                          </td>
                        </tr>

                        {/* LEVEL 3: TASKS */}
                        {isProjExpanded && projGroup.tasks.map((task) => (
                          <tr 
                            key={task.id} 
                            style={{ borderBottom: '1px solid var(--card-border)', cursor: 'pointer', transition: 'background 0.2s', background: 'var(--bg-color)' }}
                            onClick={() => onEditTask(task)}
                            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-color)'}
                          >
                            <td style={{ padding: '0.75rem 1.5rem 0.75rem 5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ color: '#cbd5e1' }}>└──</span>
                              <CheckSquare size={14} color="#64748b" />
                              <div style={{ fontWeight: 500, color: 'var(--text-main)', fontSize: '0.9rem' }}>{task.name}</div>
                            </td>
                            <td style={{ padding: '0.75rem 1.5rem' }}>{getStatusBadge(task.status)}</td>
                            <td style={{ padding: '0.75rem 1.5rem' }}>
                              <span style={{ color: getPriorityColor(task.priority), fontWeight: 700, fontSize: '0.85rem' }}>
                                {task.priority || '-'}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              <div>{task.dueDate}</div>
                              {task.week && <div style={{ fontSize: '0.7rem', color: 'var(--primary)' }}>Week {task.week}</div>}
                            </td>
                            <td style={{ padding: '0.75rem 1.5rem' }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{task.assignee || 'Unassigned'}</div>
                              {task.participants && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>+ {task.participants}</div>}
                            </td>
                            <td style={{ padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                              {task.points || 0}
                            </td>
                            <td style={{ padding: '0.75rem 1.5rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={(e) => { e.stopPropagation(); onDeleteTask(task.name); }} 
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.5rem', borderRadius: '6px' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                title="Xóa Task"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
            
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Không tìm thấy dữ liệu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
