import { useState, useCallback } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useBoard } from '../contexts/BoardContext';
import { COLUMN_ORDER } from '../utils/constants';
import Header from './Header';
import Column from './Column';
import TaskModal from './TaskModal';
import ActivityLog from './ActivityLog';

export default function BoardPage() {
  const { filteredColumns, moveTask, addTask, editTask, deleteTask } = useBoard();

  const [modalState, setModalState] = useState({ open: false, task: null, columnId: null });

  const handleDragEnd = useCallback(
    (result) => {
      const { source, destination } = result;
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      moveTask(source.droppableId, destination.droppableId, source.index, destination.index);
    },
    [moveTask]
  );

  const openCreateModal = () => {
    setModalState({ open: true, task: null, columnId: 'todo' });
  };

  const openEditModal = (task, columnId) => {
    setModalState({ open: true, task, columnId });
  };

  const closeModal = () => {
    setModalState({ open: false, task: null, columnId: null });
  };

  const handleSave = (formData) => {
    if (modalState.task) {
      editTask(modalState.columnId, modalState.task.id, formData);
    } else {
      addTask(modalState.columnId, formData);
    }
    closeModal();
  };

  return (
    <div className="board-page">
      <Header onAddTask={openCreateModal} />

      <main className="board-container">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board-columns">
            {COLUMN_ORDER.map((colId) => (
              <Column
                key={colId}
                columnId={colId}
                tasks={filteredColumns[colId] || []}
                onEdit={openEditModal}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </main>

      <ActivityLog />

      {modalState.open && (
        <TaskModal
          task={modalState.task}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
