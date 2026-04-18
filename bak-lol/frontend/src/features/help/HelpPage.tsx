import { useState } from 'react';
import { MOCK_HELP_REQUESTS } from '../../data/mock';
import { HelpRequest } from '../../types';
import { HelpCard } from './HelpCard';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { TextInput, TextArea, SelectInput } from '../../components/Input';
import { useAuthStore } from '../../store/authStore';

const CAT_TABS = ['all', 'item', 'help', 'other'] as const;

export function HelpPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<HelpRequest[]>(MOCK_HELP_REQUESTS);
  const [catFilter, setCatFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'help' });

  const filtered = requests.filter((r) => {
    if (catFilter !== 'all' && r.category !== catFilter) return false;
    if (!showResolved && r.is_resolved) return false;
    return true;
  });

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const req: HelpRequest = {
      id: `h${Date.now()}`,
      poster_id: user?.id ?? 'me',
      poster: user ?? undefined,
      category: form.category as 'item' | 'help' | 'other',
      title: form.title,
      description: form.description || undefined,
      is_resolved: false,
      response_count: 0,
      created_at: new Date().toISOString(),
    };
    setRequests((prev) => [req, ...prev]);
    setForm({ title: '', description: '', category: 'help' });
    setCreateOpen(false);
  };

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Help & Requests</h1>
          <p style={{ color: 'var(--color-text-soft)', fontSize: 'var(--fs-sm)', marginTop: 4 }}>
            Ask for help or lend a hand to a fellow hosteller
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>+ Post Request</Button>
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center' }}>
        {CAT_TABS.map((c) => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            style={{
              padding: '5px var(--space-3)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              fontSize: 'var(--fs-sm)',
              cursor: 'pointer',
              background: catFilter === c ? 'var(--color-primary)' : 'transparent',
              color: catFilter === c ? '#fff' : 'var(--color-text-soft)',
              borderColor: catFilter === c ? 'var(--color-primary)' : 'var(--color-border)',
              textTransform: 'capitalize',
            }}
          >
            {c === 'all' ? 'All' : c === 'item' ? '📦 Item' : c === 'help' ? '🤝 Help' : '• Other'}
          </button>
        ))}

        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', marginLeft: 'auto', cursor: 'pointer' }}>
          <input type="checkbox" checked={showResolved} onChange={(e) => setShowResolved(e.target.checked)} />
          Show resolved
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🤝</div>
          <div className="empty-state__title">No requests here</div>
          <div className="empty-state__desc">Be the first to post a request!</div>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map((r) => <HelpCard key={r.id} request={r} />)}
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Post a Request"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Post</Button>
          </>
        }
      >
        <SelectInput
          id="help-cat"
          label="Category *"
          value={form.category}
          onChange={setF('category')}
          placeholder=""
          options={[
            { value: 'item', label: '📦 Item (borrow something)' },
            { value: 'help', label: '🤝 Help (need assistance)' },
            { value: 'other', label: '• Other' },
          ]}
        />
        <TextInput id="help-title" label="Title *" placeholder="e.g. Need a calculator for tomorrow" value={form.title} onChange={setF('title')} />
        <TextArea id="help-desc" label="Description" placeholder="Give more details — hostel, time, etc." value={form.description} onChange={setF('description')} />
      </Modal>
    </main>
  );
}
