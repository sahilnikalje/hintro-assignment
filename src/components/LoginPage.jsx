import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, Layout } from 'lucide-react';

export default function LoginPage() {
  const { login, rememberedEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState(rememberedEmail || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!rememberedEmail);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for UX feel
    await new Promise((r) => setTimeout(r, 400));

    const result = login(email, password, rememberMe);
    if (result.success) {
      navigate('/board', { replace: true });
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-pattern" />
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Layout size={28} />
          </div>
          <h1>TaskBoard</h1>
          <p>Sign in to manage your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form" id="login-form">
          {error && (
            <div className="login-error" role="alert" id="login-error">
              <span className="login-error-icon">!</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="intern@demo.com"
              autoComplete="email"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="toggle-password"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group-row">
            <label className="checkbox-label" htmlFor="remember-me">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkbox-custom" />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="login-submit"
            disabled={isLoading}
            id="login-submit"
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Demo credentials: <code>intern@demo.com</code> / <code>intern123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
