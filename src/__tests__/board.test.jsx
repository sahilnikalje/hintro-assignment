import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BoardProvider, useBoard } from '../contexts/BoardContext';

// Test component that exposes board actions
function TestBoard() {
  const { columns, addTask, editTask, deleteTask, filteredColumns } = useBoard();

  return (
    <div>
      <button
        onClick={() =>
          addTask('todo', {
            title: 'Test Task',
            description: 'Test Description',
            priority: 'high',
            dueDate: '2026-12-31',
            tags: ['test'],
          })
        }
      >
        Add Task
      </button>

      <div data-testid="todo-count">{columns.todo.length}</div>

      <div data-testid="todo-list">
        {columns.todo.map((task) => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            <span data-testid="task-title">{task.title}</span>
            <span data-testid="task-priority">{task.priority}</span>
            <button
              onClick={() =>
                editTask('todo', task.id, { title: 'Updated Task', priority: 'low' })
              }
            >
              Edit
            </button>
            <button onClick={() => deleteTask('todo', task.id, task.title)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

describe('Board Operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a task to the todo column', () => {
    render(
      <BoardProvider>
        <TestBoard />
      </BoardProvider>
    );

    expect(screen.getByTestId('todo-count').textContent).toBe('0');
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByTestId('todo-count').textContent).toBe('1');
    expect(screen.getByTestId('task-title').textContent).toBe('Test Task');
    expect(screen.getByTestId('task-priority').textContent).toBe('high');
  });

  it('edits a task', () => {
    render(
      <BoardProvider>
        <TestBoard />
      </BoardProvider>
    );

    fireEvent.click(screen.getByText('Add Task'));
    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByTestId('task-title').textContent).toBe('Updated Task');
    expect(screen.getByTestId('task-priority').textContent).toBe('low');
  });

  it('deletes a task', () => {
    render(
      <BoardProvider>
        <TestBoard />
      </BoardProvider>
    );

    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByTestId('todo-count').textContent).toBe('1');

    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId('todo-count').textContent).toBe('0');
  });
});
