// import React, { useState } from 'react';
// import { closestCenter, DndContext } from '@dnd-kit/core';
// import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
//
// interface Card {
//   id: number;
//   title: string;
//   description: string;
// }
//
// interface Column {
//   id: number;
//   title: string;
//   cards: Card[];
// }
//
// const initialColumns: Column[] = [
//   {
//     id: 1,
//     title: 'To Do',
//     cards: [
//       { id: 1, title: 'Task 1', description: 'Description for Task 1' },
//       { id: 2, title: 'Task 2', description: 'Description for Task 2' },
//     ],
//   },
//   {
//     id: 2,
//     title: 'In Progress',
//     cards: [{ id: 3, title: 'Task 3', description: 'Description for Task 3' }],
//   },
//   {
//     id: 3,
//     title: 'Done',
//     cards: [{ id: 4, title: 'Task 4', description: 'Description for Task 4' }],
//   },
// ];
//
// const SortableItem: React.FC<{ id: number; children: React.ReactNode }> = ({ id, children }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
//
//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     touchAction: 'none', // Ensure touch action is none for better drag experience
//   };
//
//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// };
//
// const KanbanBoard = () => {
//   const [columns, setColumns] = useState<Column[]>(initialColumns);
//
//   const handleDragEnd = (event) => {
//     const { active, over } = event;
//
//     if (active.id !== over.id) {
//       setColumns((columns) => {
//         const oldIndex = columns.findIndex((column) => column.cards.some((card) => card.id === active.id));
//         const newIndex = columns.findIndex((column) => column.cards.some((card) => card.id === over.id));
//
//         const oldColumn = columns[oldIndex];
//         const newColumn = columns[newIndex];
//
//         const oldCardIndex = oldColumn.cards.findIndex((card) => card.id === active.id);
//         const newCardIndex = newColumn.cards.findIndex((card) => card.id === over.id);
//
//         const newColumns = [...columns];
//
//         if (oldIndex === newIndex) {
//           newColumns[oldIndex].cards = arrayMove(oldColumn.cards, oldCardIndex, newCardIndex);
//         } else {
//           const [movedCard] = newColumns[oldIndex].cards.splice(oldCardIndex, 1);
//           newColumns[newIndex].cards.splice(newCardIndex, 0, movedCard);
//         }
//
//         return newColumns;
//       });
//     }
//   };
//
//   return (
//     <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <Box>
//         <Typography variant="h4" gutterBottom>
//           Kanban Board
//         </Typography>
//         <Grid container spacing={2}>
//           {columns.map((column) => (
//             <Grid item xs={12} md={4} key={column.id}>
//               <Box>
//                 <Typography variant="h6">{column.title}</Typography>
//                 <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
//                   {column.cards.map((card) => (
//                     <SortableItem key={card.id} id={card.id}>
//                       <Card sx={{ mb: 2 }}>
//                         <CardContent>
//                           <Typography variant="h5">{card.title}</Typography>
//                           <Typography>{card.description}</Typography>
//                         </CardContent>
//                       </Card>
//                     </SortableItem>
//                   ))}
//                 </SortableContext>
//                 <Button variant="contained" sx={{ mt: 2 }}>
//                   Add Card
//                 </Button>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </DndContext>
//   );
// };
//
// export default KanbanBoard;

import React, { useState } from 'react';
import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { arrayMove, rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';

import KanbanColumn from './KanbanColumn';

type ColumnData = {
  [key: string]: string[];
};

const initialData: ColumnData = {
  todo: ['Task 1', 'Task 2'],
  inProgress: ['Task 3'],
  done: ['Task 4'],
};

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnData>(initialData);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveItem(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (activeContainer !== overContainer) {
      setColumns((prev) => {
        const activeItems = [...prev[activeContainer!]];
        const overItems = [...prev[overContainer!]];

        const activeIndex = activeItems.indexOf(active.id as string);
        activeItems.splice(activeIndex, 1);
        overItems.push(active.id as string);

        return {
          ...prev,
          [activeContainer!]: activeItems,
          [overContainer!]: overItems,
        };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (activeContainer === overContainer) {
      setColumns((prev) => {
        const items = [...prev[activeContainer!]];
        const activeIndex = items.indexOf(active.id as string);
        const overIndex = items.indexOf(over.id as string);

        return {
          ...prev,
          [activeContainer!]: arrayMove(items, activeIndex, overIndex),
        };
      });
    }
    setActiveItem(null);
  };

  const findContainer = (id: string): string | undefined => {
    console.log({ id, container: Object.keys(columns).find((key) => columns[key].includes(id)) });

    return Object.keys(columns).find((key) => columns[key].includes(id));
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
        {Object.keys(columns).map((key) => (
          <SortableContext key={key} items={columns[key]} strategy={rectSortingStrategy}>
            <KanbanColumn id={key} items={columns[key]} />
          </SortableContext>
        ))}
      </div>
      <DragOverlay>
        {activeItem ? (
          <div
            style={{
              padding: '8px',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {activeItem}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
