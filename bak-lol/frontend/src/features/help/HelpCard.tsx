import { HelpRequest } from '../../types';
import { Badge, Tag } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface HelpCardProps {
  request: HelpRequest;
  onRespond?: (id: string) => void;
}

export function HelpCard({ request, onRespond }: HelpCardProps) {
  return (
    <div className="card card--hover" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={request.category}>{request.category === 'item' ? '📦 Item' : request.category === 'help' ? '🤝 Help' : '• Other'}</Badge>
        <Badge variant={request.is_resolved ? 'closed' : 'open'} showIcon={false}>
          {request.is_resolved ? 'Resolved' : 'Open'}
        </Badge>
      </div>

      <div>
        <Link to={`/help/${request.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, color: 'var(--color-text)', lineHeight: 'var(--lh-snug)' }}>
            {request.title}
          </h3>
        </Link>
        {request.description && (
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', marginTop: 4, lineHeight: 'var(--lh-snug)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {request.description}
          </p>
        )}
      </div>

      <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <span>💬 {request.response_count} {request.response_count === 1 ? 'response' : 'responses'}</span>
        <span>🕑 {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}</span>
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-soft)' }}>
        {request.poster ? (
          <div className="flex items-center gap-2">
            <Avatar student={request.poster} size="sm" />
            <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-soft)' }}>{request.poster.name}</span>
            {request.poster.hostel && <Tag>{request.poster.hostel.split(' ')[0]}</Tag>}
          </div>
        ) : <span />}

        {!request.is_resolved && (
          <Button variant="outline" size="sm" onClick={() => onRespond?.(request.id)}>
            Respond
          </Button>
        )}
      </div>
    </div>
  );
}
