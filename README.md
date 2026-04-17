# TaskBoard — Kanban Task Management App

A modern, feature-rich Kanban-style task board built with **React 18** and **Vite**.  
Drag and drop tasks between columns, search, filter, sort, and track all activity — all with a premium dark glassmorphism UI.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

### Authentication
- Static login flow with hardcoded credentials
- **Email:** `intern@demo.com` | **Password:** `intern123`
- Remember me functionality
- Protected routes (redirect to login if unauthenticated)
- Logout with session cleanup

### Task Board
- **Three columns:** Todo → Doing → Done
- **Drag & Drop** tasks between columns (powered by `@hello-pangea/dnd`)
- **Create / Edit / Delete** tasks with full form validation
- Each task supports: Title, Description, Priority, Due Date, Tags, CreatedAt

### Search, Filter & Sort
- 🔍 **Search** tasks by title (real-time)
- 🏷️ **Filter** by priority (High / Medium / Low)
- 📅 **Sort** by due date (ascending/descending, empty dates last)

### Persistence & Reliability
- Board state persists across browser refresh (localStorage)
- Safe handling of missing or corrupted storage data
- **Reset Board** with confirmation dialog

### Activity Log
- Tracks all actions: created, edited, moved, deleted, reset
- Slide-in panel with relative timestamps
- Color-coded action types with icons

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 6 | Build tool & dev server |
| React Router v6 | Client-side routing |
| @hello-pangea/dnd | Drag and drop |
| Lucide React | Icons |
| Vitest + React Testing Library | Testing |
| Vanilla CSS | Styling (dark glassmorphism theme) |
| localStorage | Data persistence |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd hintro-assignment

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm test
```

---

## 📁 Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Router & providers setup
├── index.css                   # Global styles & design system
├── contexts/
│   ├── AuthContext.jsx         # Authentication state management
│   └── BoardContext.jsx        # Board state with useReducer
├── components/
│   ├── LoginPage.jsx           # Login form with validation
│   ├── ProtectedRoute.jsx      # Route guard
│   ├── BoardPage.jsx           # Main board with DragDropContext
│   ├── Header.jsx              # Search, filter, sort, actions
│   ├── Column.jsx              # Droppable column container
│   ├── TaskCard.jsx            # Draggable task card
│   ├── TaskModal.jsx           # Create/Edit task modal
│   ├── ActivityLog.jsx         # Activity history panel
│   └── ConfirmDialog.jsx       # Reusable confirmation dialog
├── utils/
│   ├── storage.js              # Safe localStorage wrappers
│   └── constants.js            # App constants & config
└── __tests__/
    ├── auth.test.jsx           # Authentication tests
    ├── board.test.jsx          # Board CRUD tests
    └── storage.test.js         # Storage utility tests
```

---

## 🏗️ Architecture & Design Decisions

### State Management
- **AuthContext** — React Context for authentication state (login, logout, session persistence)
- **BoardContext** — React Context + `useReducer` for complex board state (tasks, columns, activity log)
- All state changes are automatically persisted to `localStorage` via `useEffect`

### Component Design
- **Reusable components** — `ConfirmDialog` is used for both task deletion and board reset
- **Smart/dumb separation** — `BoardPage` orchestrates state, child components receive data via props
- **Form validation** — `TaskModal` validates required fields with error messages

### Drag & Drop
- Uses `@hello-pangea/dnd` (maintained fork of `react-beautiful-dnd`)
- Supports reordering within columns and moving between columns
- Visual feedback with highlight and rotation during drag

### Styling
- **Vanilla CSS** with CSS custom properties for theming
- **Dark glassmorphism** design with backdrop-filter and semi-transparent backgrounds
- **Responsive** — works on desktop, tablet, and mobile
- **Micro-animations** — card hover effects, modal transitions, shake on error

---

## 🧪 Testing

3 test suites with 10+ combined test cases:

| Suite | Tests |
|---|---|
| `auth.test.jsx` | Login form rendering, invalid credentials error, session persistence |
| `board.test.jsx` | Add task, edit task, delete task |
| `storage.test.js` | Missing keys, corrupted JSON, round-trip persistence |

Run with: `npm test`

---

## 📦 Deployment

This project is deployed at: *[Add deployed URL here]*

To deploy:
1. `npm run build` — generates static files in `dist/`
2. Deploy the `dist/` folder to any static hosting (Vercel, Netlify, GitHub Pages)

For **Vercel**:
```bash
npm i -g vercel
vercel
```

For **Netlify**, add a `_redirects` file in `public/`:
```
/*    /index.html   200
```

---

## 📝 License

MIT