import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from '../components/LoginPage';

// Helper to render with providers
function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  );
}

describe('Authentication', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login form with all fields', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error for invalid credentials', async () => {
    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@email.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i);
    });
  });

  it('successful login stores session in localStorage', async () => {
    renderWithProviders(<LoginPage />);

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'intern@demo.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'intern123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('taskboard_auth'));
      expect(stored).not.toBeNull();
      expect(stored.email).toBe('intern@demo.com');
    });
  });
});
