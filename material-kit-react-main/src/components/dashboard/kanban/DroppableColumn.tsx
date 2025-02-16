'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const DroppableColumn = React.memo(({ columnId, children }: { columnId: string; children: React.ReactNode }) => {
  const { setNodeRef } = useDroppable({ id: columnId });

  return (
    <div
      ref={setNodeRef}
      style={{ minHeight: '150px', borderRadius: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}
    >
      {children}
    </div>
  );
});

export default DroppableColumn;
