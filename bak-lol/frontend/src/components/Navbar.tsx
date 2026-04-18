import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Avatar } from './Avatar';

const NAV_LINKS = [
  { to: '/',           label: 'Home',       icon: '🏠' },
  { to: '/activities', label: 'Activities', icon: '🎯' },
  { to: '/help',       label: 'Help',       icon: '🤝' },
  { to: '/posts',      label: 'Posts',      icon: '📋' },
  { to: '/students',   label: 'Students',   icon: '👥' },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(250, 243, 224, 0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--color-border-soft)',
      height: 'var(--topbar-h)',
    }}>
      <div style={{
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        padding: '0 var(--space-6)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: '1.3rem' }}>🌿</span>
          <span style={{ fontWeight: 700, fontSize: 'var(--fs-lg)', color: 'var(--color-primary)', letterSpacing: '-0.01em' }}>
            Bak-Lol
          </span>
        </Link>

        {/* Desktop nav */}
        {isAuthenticated && (
          <nav style={{ display: 'flex', gap: 'var(--space-1)', alignItems: 'center' }} className="desktop-nav">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                style={({ isActive }) => ({
                  padding: 'var(--space-1) var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--fs-sm)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-soft)',
                  background: isActive ? 'rgba(140, 108, 75, 0.08)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                })}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {isAuthenticated && user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-1)',
                  borderRadius: 'var(--radius-sm)',
                }}
                aria-label="User menu"
              >
                <Avatar student={user} size="md" />
                <span style={{ fontSize: 'var(--fs-sm)', fontWeight: 500, color: 'var(--color-text)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>▾</span>
              </button>

              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-border-soft)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  minWidth: 180,
                  zIndex: 200,
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border-soft)' }}>
                    <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{user.name}</div>
                    <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>{user.hostel}</div>
                  </div>
                  <Link
                    to={`/profile/${user.id}`}
                    style={{ display: 'block', padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--fs-sm)', color: 'var(--color-text)', textDecoration: 'none' }}
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%', textAlign: 'left', background: 'none', border: 'none',
                      padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--fs-sm)',
                      color: 'var(--color-danger)', cursor: 'pointer',
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="btn btn--primary btn--sm">Sign in</button>
            </Link>
          )}

          {/* Mobile hamburger */}
          {isAuthenticated && (
            <button
              className="hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.3rem',
                color: 'var(--color-text)',
              }}
              aria-label="Menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      {isAuthenticated && menuOpen && (
        <div style={{
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border-soft)',
          padding: 'var(--space-3) var(--space-4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
        }}>
          {NAV_LINKS.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--fs-sm)',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text)',
                textDecoration: 'none',
                background: isActive ? 'rgba(140,108,75,0.08)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              })}
            >
              <span>{icon}</span> {label}
            </NavLink>
          ))}
        </div>
      )}

      {/* Close dropdown on outside click */}
      {dropdownOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          onClick={() => setDropdownOpen(false)}
        />
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
