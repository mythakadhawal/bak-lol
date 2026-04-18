import { Link } from 'react-router-dom';
import { Activity } from '../../types';
import { Badge, Tag } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { formatDistanceToNow, format } from 'date-fns';

interface ActivityCardProps {
  activity: Activity;
  onJoin?: (id: string) => void;
  onLeave?: (id: string) => void;
}

export function ActivityCard({ activity, onJoin, onLeave }: ActivityCardProps) {
  const isUpcoming = activity.status === 'upcoming';
  const isFull = activity.max_participants != null && activity.participant_count >= activity.max_participants;

  return (
    <div className="card card--hover" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Status + hostel */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={activity.status}>{activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}</Badge>
        {activity.hostel && <Tag>{activity.hostel}</Tag>}
      </div>

      {/* Title */}
      <div>
        <Link to={`/activities/${activity.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, color: 'var(--color-text)', lineHeight: 'var(--lh-snug)' }}>
            {activity.title}
          </h3>
        </Link>
        {activity.description && (
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', marginTop: 4, lineHeight: 'var(--lh-snug)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {activity.description}
          </p>
        )}
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
        <span>🕐 {format(new Date(activity.scheduled_at), 'MMM d, h:mm a')}</span>
        <span>👥 {activity.participant_count}{activity.max_participants ? `/${activity.max_participants}` : ''}</span>
        <span>🕑 posted {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
      </div>

      {/* Creator + action */}
      <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-soft)' }}>
        {activity.creator ? (
          <div className="flex items-center gap-2">
            <Avatar student={activity.creator} size="sm" />
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-soft)' }}>{activity.creator.name}</span>
          </div>
        ) : <span />}

        {isUpcoming && (
          activity.is_joined
            ? <Button variant="ghost" size="sm" onClick={() => onLeave?.(activity.id)}>Leave</Button>
            : <Button variant="outline" size="sm" disabled={isFull} onClick={() => onJoin?.(activity.id)}>
                {isFull ? 'Full' : 'Join'}
              </Button>
        )}
      </div>
    </div>
  );
}
