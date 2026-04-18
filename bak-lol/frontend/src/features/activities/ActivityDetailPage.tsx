import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_ACTIVITIES, MOCK_ACTIVITY_MESSAGES } from '../../data/mock';
import { ActivityMessage } from '../../types';
import { Badge, Tag } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { ChatBox } from '../../components/ChatBox';
import { useAuthStore } from '../../store/authStore';
import { format, formatDistanceToNow } from 'date-fns';

export function ActivityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [messages, setMessages] = useState<ActivityMessage[]>(
    MOCK_ACTIVITY_MESSAGES[id ?? ''] ?? []
  );

  const activity = activities.find((a) => a.id === id);

  if (!activity) {
    return (
      <main className="page-content">
        <div className="empty-state">
          <div className="empty-state__icon">🎯</div>
          <div className="empty-state__title">Activity not found</div>
          <Button variant="ghost" onClick={() => navigate('/activities')}>← Back to Activities</Button>
        </div>
      </main>
    );
  }

  const handleJoin = () =>
    setActivities((prev) => prev.map((a) => a.id === id ? { ...a, is_joined: true, participant_count: a.participant_count + 1 } : a));
  const handleLeave = () =>
    setActivities((prev) => prev.map((a) => a.id === id ? { ...a, is_joined: false, participant_count: a.participant_count - 1 } : a));

  const handleSendMessage = (content: string) => {
    if (!user) return;
    const msg: ActivityMessage = {
      id: `msg-${Date.now()}`,
      activity_id: id!,
      sender_id: user.id,
      sender: user,
      content,
      sent_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const isFull = activity.max_participants != null && activity.participant_count >= activity.max_participants;

  return (
    <main className="page-content">
      <Link to="/activities" style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-4)' }}>
        ← Back to Activities
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Header card */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 'var(--space-3)' }}>
              <Badge variant={activity.status}>{activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}</Badge>
              {activity.hostel && <Tag>{activity.hostel}</Tag>}
            </div>

            <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, lineHeight: 'var(--lh-snug)', marginBottom: 'var(--space-3)' }}>
              {activity.title}
            </h1>

            {activity.description && (
              <p style={{ fontSize: 'var(--fs-base)', color: 'var(--color-text-soft)', lineHeight: 'var(--lh-normal)', marginBottom: 'var(--space-4)' }}>
                {activity.description}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-5)', fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)' }}>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>When</div>
                {format(new Date(activity.scheduled_at), 'EEEE, MMM d • h:mm a')}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Participants</div>
                {activity.participant_count}{activity.max_participants ? ` / ${activity.max_participants}` : ''}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Posted</div>
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </div>
            </div>

            {activity.status === 'upcoming' && (
              <div style={{ marginTop: 'var(--space-5)' }}>
                {activity.is_joined
                  ? <Button variant="ghost" onClick={handleLeave}>Leave activity</Button>
                  : <Button variant="primary" onClick={handleJoin} disabled={isFull}>{isFull ? 'Activity is full' : 'Join activity'}</Button>
                }
              </div>
            )}
          </div>

          {/* Chat */}
          <div>
            <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
              Activity Chat
            </h2>
            {activity.is_joined || activity.creator_id === user?.id ? (
              <ChatBox messages={messages} onSend={handleSendMessage} placeholder="Chat with participants..." />
            ) : (
              <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>
                Join this activity to participate in the chat.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — creator */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {activity.creator && (
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
                Organiser
              </div>
              <div className="flex items-center gap-3">
                <Avatar student={activity.creator} size="lg" />
                <div>
                  <div style={{ fontWeight: 600 }}>{activity.creator.name}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
                    Year {activity.creator.year} · {activity.creator.department}
                  </div>
                  <Tag>{activity.creator.hostel}</Tag>
                </div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: 'var(--space-3)' }}>
              Spots
            </div>
            {activity.max_participants ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-sm)', marginBottom: 'var(--space-2)' }}>
                  <span>{activity.participant_count} joined</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>{activity.max_participants - activity.participant_count} left</span>
                </div>
                <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    borderRadius: 'var(--radius-full)',
                    background: isFull ? 'var(--color-danger)' : 'var(--color-secondary)',
                    width: `${Math.min(100, (activity.participant_count / activity.max_participants) * 100)}%`,
                    transition: 'width var(--transition-slow)',
                  }} />
                </div>
              </>
            ) : (
              <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)' }}>
                {activity.participant_count} joined · No limit
              </span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .act-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
