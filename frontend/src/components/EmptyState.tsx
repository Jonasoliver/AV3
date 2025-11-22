import React from 'react'
export const EmptyState: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="empty">
    <p className="muted" style={{fontSize:16}}>{title}</p>
    {action && <div style={{marginTop:12}}>{action}</div>}
  </div>
)
