import { Droppable } from '@hello-pangea/dnd';
import { COLUMNS } from '../utils/constants';
import TaskCard from './TaskCard';

export default function Column({ columnId, tasks, onEdit, onDelete }) {
  const column = COLUMNS[columnId];
  const count = tasks.length;

  return (
    <div className="column" id={`column-${columnId}`}>
      <div className="column-header">
        <div className="column-title-row">
          <span className="column-dot" style={{ background: column.color }} />
          <h2 className="column-title">{column.title}</h2>
          <span className="column-count">{count}</span>
        </div>
      </div>

      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            className={`column-body ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="column-empty">
                <p>No tasks yet</p>
              </div>
            )}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={columnId}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
