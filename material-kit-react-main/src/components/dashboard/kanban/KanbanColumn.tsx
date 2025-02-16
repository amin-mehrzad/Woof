import React from 'react';
import { useDroppable } from '@dnd-kit/core';

import KanbanCard from './KanbanCard';

type KanbanColumnProps = {
  id: string;
  items: string[];
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, items }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h3>{id.toUpperCase()}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map((item) => (
          <KanbanCard key={item} id={item} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
