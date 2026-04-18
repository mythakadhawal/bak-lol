import { useState, useRef, useEffect } from 'react';
import { ActivityMessage } from '../types';
import { Avatar } from './Avatar';
import { Button } from './Button';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../store/authStore';

interface ChatBoxProps {
  messages: ActivityMessage[];
  onSend: (content: string) => void;
  placeholder?: string;
}

export function ChatBox({ messages, onSend, placeholder = 'Type a message...' }: ChatBoxProps) {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      border: '1px solid var(--color-border-soft)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--color-white)',
    }}>
      {/* Messages */}
      <div style={{
        flex: 1,
        minHeight: 200,
        maxHeight: 340,
        overflowY: 'auto',
        padding: 'var(--space-4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
      }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--fs-sm)', textAlign: 'center', marginTop: 'var(--space-6)' }}>
            No messages yet. Start the conversation!
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id;
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                gap: 'var(--space-2)',
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              {msg.sender && (
                <Avatar student={msg.sender} size="sm" />
              )}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                alignItems: isMe ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
              }}>
                {msg.sender && (
                  <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    {isMe ? 'You' : msg.sender.name}
                  </span>
                )}
                <div style={{
                  background: isMe ? 'var(--color-primary)' : 'var(--color-card)',
                  color: isMe ? '#fff' : 'var(--color-text)',
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: isMe
                    ? 'var(--radius-md) var(--radius-sm) var(--radius-sm) var(--radius-md)'
                    : 'var(--radius-sm) var(--radius-md) var(--radius-md) var(--radius-sm)',
                  fontSize: 'var(--fs-sm)',
                  lineHeight: 'var(--lh-snug)',
                  wordBreak: 'break-word',
                }}>
                  {msg.content}
                </div>
                <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)' }}>
                  {formatDistanceToNow(new Date(msg.sent_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop: '1px solid var(--color-border-soft)',
        padding: 'var(--space-3)',
        display: 'flex',
        gap: 'var(--space-2)',
        background: 'var(--color-bg)',
      }}>
        <input
          className="input"
          style={{ flex: 1, fontSize: 'var(--fs-sm)' }}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
        />
        <Button variant="primary" size="sm" onClick={handleSend} disabled={!text.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
