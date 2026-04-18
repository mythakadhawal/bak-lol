import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_STUDENTS, MOCK_ACTIVITIES, MOCK_POSTS } from '../data/mock';
import { Avatar } from '../components/Avatar';
import { Tag } from '../components/Badge';
import { Button } from '../components/Button';
import { ActivityCard } from '../features/activities/ActivityCard';
import { PostCard } from '../features/posts/PostCard';
import { useAuthStore } from '../store/authStore';
import { format } from 'date-fns';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const student = id === 'me' || id === user?.id
    ? user
    : MOCK_STUDENTS.find((s) => s.id === id);

  if (!student) {
    return (
      <main className="page-content">
        <div className="empty-state">
          <div className="empty-state__icon">👤</div>
          <div className="empty-state__title">Student not found</div>
          <Button variant="ghost" onClick={() => navigate('/students')}>← Back to Students</Button>
        </div>
      </main>
    );
  }

  const createdActivities = MOCK_ACTIVITIES.filter((a) => a.creator_id === student.id).slice(0, 3);
  const authoredPosts = MOCK_POSTS.filter((p) => p.author_id === student.id).slice(0, 3);
  const isSelf = student.id === user?.id || student.id === 'me';

  return (
    <main className="page-content" style={{ maxWidth: 740 }}>
      <Link to="/students" style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-4)' }}>
        ← Students
      </Link>

      {/* Profile header */}
      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
          <Avatar student={student} size="xl" />
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-2)' }}>
              <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700 }}>{student.name}</h1>
              {isSelf && <Tag>You</Tag>}
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
              <Tag>Year {student.year}</Tag>
              <Tag>{student.department}</Tag>
              <Tag>{student.hostel}</Tag>
            </div>

            {student.bio && (
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', lineHeight: 'var(--lh-normal)' }}>
                {student.bio}
              </p>
            )}

            {student.email && (
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
                📧 {student.email}
              </p>
            )}

            {student.created_at && (
              <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>
                Joined {format(new Date(student.created_at), 'MMMM yyyy')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Activities */}
      {createdActivities.length > 0 && (
        <section style={{ marginBottom: 'var(--space-6)' }}>
          <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
            Activities organised
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {createdActivities.map((a) => <ActivityCard key={a.id} activity={a} />)}
          </div>
        </section>
      )}

      {/* Posts */}
      {authoredPosts.length > 0 && (
        <section>
          <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
            Posts
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {authoredPosts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      {createdActivities.length === 0 && authoredPosts.length === 0 && (
        <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
          No activities or posts yet.
        </div>
      )}
    </main>
  );
}
