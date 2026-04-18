import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, demoLogin } from '../../store/authStore';
import { Button } from '../../components/Button';
import { TextInput } from '../../components/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const { } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isUgMode = identifier.toUpperCase().startsWith('UG');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setError('No live backend connected. Use the demo login below.');
  };

  const handleDemo = () => {
    demoLogin();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-6)',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🌿</div>
          <h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 700, color: 'var(--color-primary)' }}>
            Bak-Lol
          </h1>
          <p style={{ color: 'var(--color-text-soft)', marginTop: 'var(--space-1)', fontSize: 'var(--fs-sm)' }}>
            Your hostel community
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--fs-xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
            Sign in
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <TextInput
              id="login-identifier"
              label={isUgMode ? 'UG Number' : 'College Email'}
              type={isUgMode ? 'text' : 'email'}
              placeholder="e.g. arjun@college.edu or UG240001"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
            />

            {isUgMode && (
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginTop: -12 }}>
                UG number login is available for first-year students.
              </p>
            )}

            <TextInput
              id="login-password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-danger)', background: 'rgba(176,92,92,0.08)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Sign in
            </Button>
          </form>

          <div style={{ textAlign: 'center', margin: 'var(--space-4) 0', color: 'var(--color-text-muted)', fontSize: 'var(--fs-xs)' }}>
            — or —
          </div>

          <Button variant="ghost" fullWidth onClick={handleDemo}>
            🚀  Try demo (no login)
          </Button>

          <p style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', marginTop: 'var(--space-6)' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
