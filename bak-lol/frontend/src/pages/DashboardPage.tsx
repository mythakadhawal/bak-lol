import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { MOCK_ACTIVITIES, MOCK_HELP_REQUESTS, MOCK_POSTS } from '../data/mock';
import { ActivityCard } from '../features/activities/ActivityCard';
import { HelpCard } from '../features/help/HelpCard';
import { PostCard } from '../features/posts/PostCard';

export function DashboardPage() {
  const { user } = useAuthStore();
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  const upcomingAll = activities.filter((a) => a.status === 'upcoming').slice(0, 3);
  const recentHelp = MOCK_HELP_REQUESTS.filter((h) => !h.is_resolved).slice(0, 3);
  const recentPosts = MOCK_POSTS.slice(0, 3);

  const handleJoin = (id: string) =>
    setActivities((prev) => prev.map((a) => a.id === id ? { ...a, is_joined: true, participant_count: a.participant_count + 1 } : a));
  const handleLeave = (id: string) =>
    setActivities((prev) => prev.map((a) => a.id === id ? { ...a, is_joined: false, participant_count: a.participant_count - 1 } : a));

  return (
    <main className="page-content">
      {/* Greeting */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="page-title">
          Hey{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p style={{ color: 'var(--color-text-soft)', marginTop: 'var(--space-1)' }}>
          Here's what's happening in your hostel today.
        </p>
      </div>

      {/* Stats strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-8)',
      }}>
        {[
          { label: 'Upcoming activities', value: activities.filter((a) => a.status === 'upcoming').length, icon: '🎯', to: '/activities' },
          { label: 'Open help requests', value: MOCK_HELP_REQUESTS.filter((h) => !h.is_resolved).length, icon: '🤝', to: '/help' },
          { label: 'Posts this week', value: MOCK_POSTS.length, icon: '📋', to: '/posts' },
          { label: 'Students online', value: 24, icon: '👥', to: '/students' },
        ].map((stat) => (
          <Link key={stat.label} to={stat.to} style={{ textDecoration: 'none' }}>
            <div className="card card--hover" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 'var(--space-1)' }}>{stat.icon}</div>
              <div style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, color: 'var(--color-primary)' }}>{stat.value}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
        {/* Activities */}
        <section>
          <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600 }}>Upcoming Activities</h2>
            <Link to="/activities" style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-primary)', fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {upcomingAll.map((a) => (
              <ActivityCard key={a.id} activity={a} onJoin={handleJoin} onLeave={handleLeave} />
            ))}
          </div>
        </section>

        {/* Help */}
        <section>
          <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600 }}>Open Help Requests</h2>
            <Link to="/help" style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-primary)', fontWeight: 500 }}>View all →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {recentHelp.map((h) => (
              <HelpCard key={h.id} request={h} />
            ))}
          </div>
        </section>
      </div>

      {/* Posts */}
      <section style={{ marginTop: 'var(--space-8)' }}>
        <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
          <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600 }}>Recent Posts</h2>
          <Link to="/posts" style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-primary)', fontWeight: 500 }}>View all →</Link>
        </div>
        <div className="grid-3">
          {recentPosts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
