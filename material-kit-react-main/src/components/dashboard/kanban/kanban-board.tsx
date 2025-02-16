'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent, useDroppable } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';

import DroppableColumn from './DroppableColumn';
import SortableItem from './SortableItem';

interface Card {
  id: string;
  title: string;
  description: string;
}

const initialData: { [key: string]: Card[] } = {
  todo: [
    { id: '1', title: 'Task 1', description: 'Description for Task 1' },
    { id: '2', title: 'Task 2', description: 'Description for Task 2' },
  ],
  inProgress: [{ id: '3', title: 'Task 3', description: 'Description for Task 3' }],
  done: [{ id: '4', title: 'Task 4', description: 'Description for Task 4' }],
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

// Modified createTask function to accept title and description
async function createTask(title: string, description: string) {
  const taskData = {
    title,
    description,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create task: ${errorText}`);
    }

    const data = await response.json();
    console.log('Task created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error creating task:', error);
  }
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<{ [key: string]: Card[] }>(initialData);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  // State for dialog and form inputs
  const [openDialog, setOpenDialog] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveItem(event.active.id as string);
  }, []);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      console.log('Updating columns:o', columns);
      const { active, over } = event;
      if (!over) return;

      const activeContainer = findContainer(active.id as string);
      let overContainer = findContainer(over.id as string);

      // Handle empty columns as drop zones
      if (!overContainer && columns[over.id]) {
        overContainer = over.id as string;
      }

      if (!activeContainer || !overContainer || activeContainer === overContainer) return;

      setColumns((prev) => {
        const activeItems = [...prev[activeContainer]];
        const overItems = [...prev[overContainer]];

        const activeIndex = activeItems.findIndex((item) => item.id === active.id);
        if (activeIndex === -1) return prev;

        const [movedItem] = activeItems.splice(activeIndex, 1);
        overItems.push(movedItem);

        // 🚀 ✅ Prevent redundant state updates
        const newColumns = {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer]: overItems,
        };

        if (JSON.stringify(prev) === JSON.stringify(newColumns)) {
          return prev; // 🔥 Stop unnecessary re-renders
        }

        return newColumns;
      });
    },
    [columns]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      console.log('Updating columns:e', columns);
      const { active, over } = event;
      if (!over) return;

      const activeContainer = findContainer(active.id as string);
      let overContainer = findContainer(over.id as string);

      if (!overContainer && columns[over.id]) {
        overContainer = over.id as string;
      }

      if (!activeContainer || !overContainer) return;

      if (activeContainer === overContainer) {
        const items = [...columns[activeContainer]];
        const activeIndex = items.findIndex((item) => item.id === active.id);
        const overIndex = items.findIndex((item) => item.id === over.id);

        if (activeIndex !== overIndex && overIndex !== -1) {
          setColumns((prev) => {
            const newColumns = { ...prev, [activeContainer]: arrayMove(items, activeIndex, overIndex) };
            return JSON.stringify(prev) === JSON.stringify(newColumns) ? prev : newColumns;
          });
        }
      }

      setActiveItem(null);
    },
    [columns]
  );

  // Open dialog when clicking Add Task Card button
  const handleOpenDialog = () => {
    setNewTitle('');
    setNewDescription('');
    setOpenDialog(true);
  };

  // Handle closing dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Submit new task card from dialog
  const handleSubmitTask = async () => {
    const newTask = await createTask(newTitle, newDescription);
    if (newTask) {
      // Add the new task to the 'todo' column (or adjust as needed)
      setColumns((prev) => ({
        ...prev,
        todo: [...prev.todo, newTask],
      }));
    }
    setOpenDialog(false);
  };

  //   const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  //
  //   const handleDragEnd = useCallback(
  //     async (event: DragEndEvent) => {
  //       console.log('Updating columns:e', columns);
  //       const { active, over } = event;
  //       if (!over) return;
  //
  //       const activeContainer = findContainer(active.id as string);
  //       let overContainer = findContainer(over.id as string);
  //
  //       if (!overContainer && columns[over.id]) {
  //         overContainer = over.id as string;
  //       }
  //
  //       if (!activeContainer || !overContainer) return;
  //
  //       if (activeContainer === overContainer) {
  //         // Reorder within the same column
  //         const items = [...columns[activeContainer]];
  //         const activeIndex = items.findIndex((item) => item.id === active.id);
  //         const overIndex = items.findIndex((item) => item.id === over.id);
  //
  //         if (activeIndex !== overIndex && overIndex !== -1) {
  //           setColumns((prev) => {
  //             const newColumns = {
  //               ...prev,
  //               [activeContainer]: arrayMove(items, activeIndex, overIndex),
  //             };
  //             return JSON.stringify(prev) === JSON.stringify(newColumns) ? prev : newColumns;
  //           });
  //         }
  //       } else {
  //         // Task moved between columns: update state and call the API
  //         // Update local state first (optimistic update)
  //         setColumns((prev) => {
  //           const activeItems = [...prev[activeContainer]];
  //           const overItems = [...prev[overContainer]];
  //
  //           const activeIndex = activeItems.findIndex((item) => item.id === active.id);
  //           if (activeIndex === -1) return prev;
  //
  //           const [movedItem] = activeItems.splice(activeIndex, 1);
  //           overItems.push(movedItem);
  //
  //           return {
  //             ...prev,
  //             [activeContainer]: activeItems,
  //             [overContainer]: overItems,
  //           };
  //         });
  //
  //         // Now call the API to persist the change.
  //         try {
  //           const taskId = active.id; // assuming the card's id is the taskId
  //           const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign-column`, {
  //             method: 'PATCH',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //             // If your backend expects a numeric columnId, convert overContainer to a number:
  //             body: JSON.stringify({ columnId: overContainer }),
  //           });
  //
  //           if (!response.ok) {
  //             console.error('Failed to update column:', await response.text());
  //           }
  //         } catch (error) {
  //           console.error('Error updating column:', error);
  //         }
  //       }
  //
  //       setActiveItem(null);
  //     },
  //     [columns]
  //   );

  const findContainer = (id: string) => {
    return Object.keys(columns).find((key) => columns[key].some((card) => card.id === id)) || null;
  };

  return (
    <>
      <DndContext onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Kanban Board
          </Typography>
          <Grid container spacing={2}>
            {Object.keys(columns).map((columnKey) => {
              const columnItems = useMemo(() => columns[columnKey].map((card) => card.id), [columns[columnKey]]);

              return (
                <Grid item xs={12} md={4} key={columnKey}>
                  <Box>
                    <Typography variant="h6">{columnKey}</Typography>
                    <DroppableColumn columnId={columnKey}>
                      <SortableContext items={columnItems}>
                        {columns[columnKey].length === 0 ? (
                          <Box sx={{ height: '50px' }} />
                        ) : (
                          columns[columnKey].map((card) => (
                            <SortableItem key={card.id} id={card.id}>
                              <Card sx={{ mb: 2 }}>
                                <CardContent>
                                  <Typography variant="h5">{card.title}</Typography>
                                  <Typography>{card.description}</Typography>
                                </CardContent>
                              </Card>
                            </SortableItem>
                          ))
                        )}
                      </SortableContext>
                    </DroppableColumn>
                    <Button variant="contained" onClick={handleOpenDialog} sx={{ mt: 2 }}>
                      Add Task Card
                    </Button>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </DndContext>
      {/* Dialog for creating a new task */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmitTask} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KanbanBoard;
