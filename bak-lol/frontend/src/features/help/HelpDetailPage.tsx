import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MOCK_HELP_REQUESTS, MOCK_HELP_RESPONSES } from '../../data/mock';
import { HelpResponse } from '../../types';
import { Avatar } from '../../components/Avatar';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { TextArea } from '../../components/Input';
import { useAuthStore } from '../../store/authStore';
import { formatDistanceToNow } from 'date-fns';

export function HelpDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [requests, setRequests] = useState(MOCK_HELP_REQUESTS);
  const [responses, setResponses] = useState<HelpResponse[]>(MOCK_HELP_RESPONSES[id ?? ''] ?? []);
  const [replyText, setReplyText] = useState('');

  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <main className="page-content">
        <div className="empty-state">
          <div className="empty-state__icon">🤝</div>
          <div className="empty-state__title">Request not found</div>
          <Button variant="ghost" onClick={() => navigate('/help')}>← Back</Button>
        </div>
      </main>
    );
  }

  const handleRespond = () => {
    if (!replyText.trim() || !user) return;
    const res: HelpResponse = {
      id: `r${Date.now()}`,
      request_id: id!,
      responder_id: user.id,
      responder: user,
      content: replyText,
      is_accepted: false,
      created_at: new Date().toISOString(),
    };
    setResponses((prev) => [...prev, res]);
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, response_count: r.response_count + 1 } : r));
    setReplyText('');
  };

  const handleMarkResolved = () =>
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, is_resolved: true } : r));

  const isOwner = user?.id === request.poster_id || request.poster_id === 'me';

  const CAT_LABEL: Record<string, string> = { item: '📦 Item', help: '🤝 Help', other: '• Other' };

  return (
    <main className="page-content" style={{ maxWidth: 680 }}>
      <Link to="/help" style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 'var(--space-4)' }}>
        ← Back to Help
      </Link>

      {/* Request card */}
      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 'var(--space-3)' }}>
          <Badge variant={request.category}>{CAT_LABEL[request.category]}</Badge>
          <Badge variant={request.is_resolved ? 'closed' : 'open'} showIcon={false}>
            {request.is_resolved ? 'Resolved' : 'Open'}
          </Badge>
        </div>

        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 700, lineHeight: 'var(--lh-snug)', marginBottom: 'var(--space-3)' }}>
          {request.title}
        </h1>

        {request.description && (
          <p style={{ fontSize: 'var(--fs-base)', color: 'var(--color-text-soft)', lineHeight: 'var(--lh-normal)', marginBottom: 'var(--space-4)' }}>
            {request.description}
          </p>
        )}

        <div className="flex items-center justify-between flex-wrap gap-3" style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-soft)' }}>
          {request.poster && (
            <div className="flex items-center gap-3">
              <Avatar student={request.poster} size="md" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 'var(--fs-sm)' }}>{request.poster.name}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
                  {request.poster.hostel} · {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          )}

          {isOwner && !request.is_resolved && (
            <Button variant="success" size="sm" onClick={handleMarkResolved}>
              ✓ Mark Resolved
            </Button>
          )}
        </div>
      </div>

      {/* Responses */}
      <h2 style={{ fontSize: 'var(--fs-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
        {responses.length} {responses.length === 1 ? 'Response' : 'Responses'}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {responses.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)' }}>No responses yet. Be the first to help!</p>
        )}
        {responses.map((res) => (
          <div key={res.id} className="card" style={{ padding: 'var(--space-4)', borderLeft: res.is_accepted ? '3px solid var(--color-success)' : undefined }}>
            {res.is_accepted && (
              <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-success)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                ✓ Accepted response
              </div>
            )}
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text)', lineHeight: 'var(--lh-normal)', marginBottom: 'var(--space-3)' }}>
              {res.content}
            </p>
            <div className="flex items-center gap-2">
              {res.responder && <Avatar student={res.responder} size="sm" />}
              {res.responder && <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-soft)', fontWeight: 500 }}>{res.responder.name}</span>}
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
                · {formatDistanceToNow(new Date(res.created_at), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Reply box */}
      {!request.is_resolved && (
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--fs-base)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Add a Response</h3>
          <TextArea
            id="help-reply"
            placeholder="How can you help?"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            style={{ marginBottom: 'var(--space-3)' }}
          />
          <Button variant="primary" onClick={handleRespond} disabled={!replyText.trim()}>
            Post Response
          </Button>
        </div>
      )}
    </main>
  );
}
