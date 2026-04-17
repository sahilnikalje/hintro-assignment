# TaskBoard

A frontend internship assignment — a functional Kanban-style task board with a static login flow, drag-and-drop, and full localStorage persistence.

Built with **React + Vite + JavaScript**.

---

## Live Demo

> Add your deployed URL here (e.g. Netlify / Vercel)

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/sahilnikalje/hintro-assignment.git
cd hintro-assignment

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Login Credentials

```
Email:    intern@demo.com
Password: intern123
```

---

## Features

### Authentication
- Hardcoded credentials with proper error messages for invalid login
- "Remember me" — persists email across sessions via localStorage
- Protected routes — unauthenticated users are redirected to `/login`
- Logout clears the session

### Task Board
- Three fixed columns: **Todo**, **Doing**, **Done**
- Each task supports: Title (required), Description, Priority, Due Date, Tags, and CreatedAt timestamp
- Create, edit, and delete tasks with confirmation dialogs
- Drag and drop tasks across columns using `@hello-pangea/dnd`
- Overdue due dates are highlighted in red

### Filtering & Search
- Search tasks by title (live filtering)
- Filter by priority: All / High / Medium / Low
- Sort by due date — tasks with no due date always appear last

### Persistence
- Full board state (tasks + activity log) persists across page refreshes via localStorage
- Auth session persists across refreshes
- Storage reads/writes are wrapped in safe helpers (handles corrupted or missing data gracefully)

### Activity Log
- Tracks: task created, edited, deleted, moved between columns, board reset
- Displays relative timestamps (e.g. "Just now", "5m ago")
- Capped at the 50 most recent entries
- Slide-in panel UI

### Other
- Reset Board with a confirmation dialog — clears all tasks and activity
- Fully responsive layout (collapses to single column on mobile)

---

## Project Structure

```
src/
├── components/
│   ├── LoginPage.jsx       # Login form with remember me + validation
│   ├── BoardPage.jsx       # Main board layout + drag-and-drop context
│   ├── Header.jsx          # Search, filter, sort, activity toggle, reset
│   ├── Column.jsx          # Droppable column wrapper
│   ├── TaskCard.jsx        # Draggable task card with edit/delete
│   ├── TaskModal.jsx       # Create / edit task form
│   ├── ActivityLog.jsx     # Slide-in activity panel
│   ├── ConfirmDialog.jsx   # Reusable confirmation modal
│   └── ProtectedRoute.jsx  # Auth guard for /board
├── contexts/
│   ├── AuthContext.jsx     # Login, logout, session state
│   └── BoardContext.jsx    # Task CRUD, move, filter, sort — via useReducer
├── utils/
│   ├── constants.js        # Column config, priorities, credentials, storage keys
│   └── storage.js          # Safe localStorage helpers

```

---

## State Management

Board state is managed with `useReducer` inside `BoardContext`. Actions:

| Action | Description |
|---|---|
| `ADD_TASK` | Adds a task to a column and logs it |
| `EDIT_TASK` | Updates task fields and logs it |
| `DELETE_TASK` | Removes a task and logs it |
| `MOVE_TASK` | Moves a task between columns and logs it |
| `RESET_BOARD` | Clears all columns and resets the activity log |

Filtered/sorted columns are derived with `useMemo` — no duplicated state.

---


## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 18 |
| Bundler | Vite |
| Routing | React Router v6 |
| Drag & Drop | @hello-pangea/dnd |
| Icons | lucide-react |
| Testing | Vitest + React Testing Library |
| Styling | Plain CSS (custom design system, no Tailwind) |
| Persistence | localStorage |