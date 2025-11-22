import React from 'react'
export const PageHeader: React.FC<{ title: string; actions?: React.ReactNode }> = ({ title, actions }) => (
  <div className="page-header">
    <h1 className="page-title">{title}</h1>
    <div className="toolbar">{actions}</div>
  </div>
)
