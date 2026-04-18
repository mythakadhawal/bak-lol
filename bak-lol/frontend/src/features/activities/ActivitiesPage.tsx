import { useState } from 'react';
import { MOCK_ACTIVITIES } from '../../data/mock';
import { Activity, HOSTELS } from '../../types';
import { ActivityCard } from './ActivityCard';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { TextInput, TextArea, SelectInput } from '../../components/Input';
import { format, addHours } from 'date-fns';

const STATUS_TABS = ['all', 'upcoming', 'ongoing', 'completed'] as const;

export function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [hostelFilter, setHostelFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  // Create form state
  const [form, setForm] = useState({
    title: '', description: '', hostel: '',
    scheduled_at: format(addHours(new Date(), 3), "yyyy-MM-dd'T'HH:mm"),
    max_participants: '',
  });

  const filtered = activities.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (hostelFilter && a.hostel !== hostelFilter && a.hostel != null) return false;
    return true;
  });

  const handleJoin = (id: string) =>
    setActivities((prev) => prev.map((a) => a.id === id ? { ...a, is_joined: true, participant_count: a.participant_count + 1 } : a));
  const handleLeave = (id: string) =>
    setActivities((prev) => prev.map((a) => a.id === id ? { ...a, is_joined: false, participant_count: a.participant_count - 1 } : a));

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      creator_id: 'me',
      title: form.title,
      description: form.description || undefined,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
      hostel: form.hostel || undefined,
      max_participants: form.max_participants ? parseInt(form.max_participants) : undefined,
      status: 'upcoming',
      participant_count: 1,
      is_joined: true,
      created_at: new Date().toISOString(),
    };
    setActivities((prev) => [newActivity, ...prev]);
    setForm({ title: '', description: '', hostel: '', scheduled_at: format(addHours(new Date(), 3), "yyyy-MM-dd'T'HH:mm"), max_participants: '' });
    setCreateOpen(false);
  };

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activities</h1>
          <p style={{ color: 'var(--color-text-soft)', fontSize: 'var(--fs-sm)', marginTop: 4 }}>
            Join or organise hostel activities
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          + New Activity
        </Button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '5px var(--space-3)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              fontSize: 'var(--fs-sm)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              background: statusFilter === s ? 'var(--color-primary)' : 'transparent',
              color: statusFilter === s ? '#fff' : 'var(--color-text-soft)',
              borderColor: statusFilter === s ? 'var(--color-primary)' : 'var(--color-border)',
              textTransform: 'capitalize',
            }}
          >
            {s}
          </button>
        ))}

        {/* Hostel filter */}
        <select className="input" style={{ maxWidth: 180, marginLeft: 'auto' }} value={hostelFilter} onChange={(e) => setHostelFilter(e.target.value)}>
          <option value="">All Hostels</option>
          {HOSTELS.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">🎯</div>
          <div className="empty-state__title">No activities found</div>
          <div className="empty-state__desc">Try adjusting your filters or create one!</div>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map((a) => (
            <ActivityCard key={a.id} activity={a} onJoin={handleJoin} onLeave={handleLeave} />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Activity"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Create</Button>
          </>
        }
      >
        <TextInput id="act-title" label="Title *" placeholder="e.g. Evening Badminton" value={form.title} onChange={setF('title')} />
        <TextArea id="act-desc" label="Description" placeholder="What's the plan?" value={form.description} onChange={setF('description')} />
        <TextInput id="act-time" label="Date & Time *" type="datetime-local" value={form.scheduled_at} onChange={setF('scheduled_at')} />
        <SelectInput
          id="act-hostel"
          label="Hostel (leave blank for all)"
          value={form.hostel}
          onChange={setF('hostel')}
          placeholder="All hostels"
          options={HOSTELS.map((h) => ({ value: h, label: h }))}
        />
        <TextInput id="act-max" label="Max participants (optional)" type="number" min="2" max="200" placeholder="No limit" value={form.max_participants} onChange={setF('max_participants')} />
      </Modal>
    </main>
  );
}
