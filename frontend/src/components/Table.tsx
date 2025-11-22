import React from 'react'
export const Table: React.FC<{ headers: React.ReactNode[]; children: React.ReactNode }> = ({ headers, children }) => (
  <table className="table">
    <thead><tr>{headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead>
    <tbody>{children}</tbody>
  </table>
)
