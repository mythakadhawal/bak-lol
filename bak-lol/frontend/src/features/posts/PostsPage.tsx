import { useState } from 'react';
import { MOCK_POSTS } from '../../data/mock';
import { Post } from '../../types';
import { PostCard } from './PostCard';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { TextInput, TextArea, SelectInput } from '../../components/Input';
import { useAuthStore } from '../../store/authStore';

const TAG_OPTIONS = [
  { value: 'study-group', label: '📚 Study Group' },
  { value: 'project', label: '🛠 Project' },
  { value: 'collaboration', label: '🤝 Collaboration' },
  { value: 'announcement', label: '📢 Announcement' },
  { value: 'other', label: '• Other' },
];

const TAG_TABS = ['all', 'study-group', 'project', 'collaboration', 'announcement'] as const;
const TAG_LABELS: Record<string, string> = {
  all: 'All',
  'study-group': '📚 Study',
  project: '🛠 Project',
  collaboration: '🤝 Collab',
  announcement: '📢 News',
};

export function PostsPage() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [tagFilter, setTagFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', tag: 'other' });

  const filtered = posts.filter((p) => tagFilter === 'all' || p.tag === tagFilter);

  const setF = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCreate = () => {
    if (!form.title.trim()) return;
    const post: Post = {
      id: `p${Date.now()}`,
      author_id: user?.id ?? 'me',
      author: user ?? undefined,
      title: form.title,
      body: form.body || undefined,
      tag: form.tag as Post['tag'],
      created_at: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
    setForm({ title: '', body: '', tag: 'other' });
    setCreateOpen(false);
  };

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Posts</h1>
          <p style={{ color: 'var(--color-text-soft)', fontSize: 'var(--fs-sm)', marginTop: 4 }}>
            Study groups, projects, and collaborations
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>+ New Post</Button>
      </div>

      {/* Tag tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        {TAG_TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTagFilter(t)}
            style={{
              padding: '5px var(--space-3)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid',
              fontSize: 'var(--fs-sm)',
              cursor: 'pointer',
              background: tagFilter === t ? 'var(--color-primary)' : 'transparent',
              color: tagFilter === t ? '#fff' : 'var(--color-text-soft)',
              borderColor: tagFilter === t ? 'var(--color-primary)' : 'var(--color-border)',
            }}
          >
            {TAG_LABELS[t] ?? t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📋</div>
          <div className="empty-state__title">No posts yet</div>
          <div className="empty-state__desc">Create the first post in this category!</div>
        </div>
      ) : (
        <div className="grid-auto">
          {filtered.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      )}

      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Post"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate}>Post</Button>
          </>
        }
      >
        <SelectInput
          id="post-tag"
          label="Category *"
          value={form.tag}
          onChange={setF('tag')}
          placeholder=""
          options={TAG_OPTIONS}
        />
        <TextInput id="post-title" label="Title *" placeholder="What's this about?" value={form.title} onChange={setF('title')} />
        <TextArea id="post-body" label="Details (optional)" placeholder="Share more context, requirements, etc." value={form.body} onChange={setF('body')} style={{ minHeight: 100 }} />
      </Modal>
    </main>
  );
}
