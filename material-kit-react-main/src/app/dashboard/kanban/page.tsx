'use client';

import * as React from 'react';

import KanbanBoard from '@/components/dashboard/kanban/kanban-board';

const Page = () => {
  return (
    <div>
      <h1>Kanban Board</h1>
      <KanbanBoard />
    </div>
  );
};

export default Page;
