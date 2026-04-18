import { Post } from '../../types';
import { Tag } from '../../components/Badge';
import { Avatar } from '../../components/Avatar';
import { formatDistanceToNow } from 'date-fns';

const TAG_LABELS: Record<string, string> = {
  'study-group': '📚 Study Group',
  'project': '🛠 Project',
  'collaboration': '🤝 Collaboration',
  'announcement': '📢 Announcement',
  'other': '• Other',
};

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="card card--hover" style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {post.tag && <Tag>{TAG_LABELS[post.tag] ?? post.tag}</Tag>}

      <div>
        <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, lineHeight: 'var(--lh-snug)', color: 'var(--color-text)' }}>
          {post.title}
        </h3>
        {post.body && (
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', marginTop: 6, lineHeight: 'var(--lh-normal)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
            {post.body}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 'auto', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--color-border-soft)' }}>
        {post.author ? (
          <div className="flex items-center gap-2">
            <Avatar student={post.author} size="sm" />
            <div>
              <div style={{ fontSize: 'var(--fs-xs)', fontWeight: 500, color: 'var(--color-text-soft)' }}>{post.author.name}</div>
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>Year {post.author.year} · {post.author.department}</div>
            </div>
          </div>
        ) : <span />}
        <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}
