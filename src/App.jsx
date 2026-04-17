import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { BoardProvider } from './contexts/BoardContext';
import LoginPage from './components/LoginPage';
import BoardPage from './components/BoardPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/board"
            element={
              <ProtectedRoute>
                <BoardProvider>
                  <BoardPage />
                </BoardProvider>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
