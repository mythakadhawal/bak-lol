import { Student } from '../types';

interface AvatarProps {
  student: Pick<Student, 'name'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const AVATAR_COLORS = [
  ['#8C6C4B', '#FAF3E0'],
  ['#A8BDAF', '#3B3A36'],
  ['#7A9E84', '#FAF3E0'],
  ['#5C80A8', '#FAF3E0'],
  ['#C9933A', '#FAF3E0'],
  ['#704F34', '#FAF3E0'],
  ['#6B6860', '#FAF3E0'],
  ['#9B9892', '#3B3A36'],
];

function getColors(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name: string) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const SIZE_MAP = {
  sm: { wh: 28, fs: '0.65rem' },
  md: { wh: 36, fs: '0.8rem' },
  lg: { wh: 44, fs: '1rem' },
  xl: { wh: 64, fs: '1.4rem' },
};

export function Avatar({ student, size = 'md' }: AvatarProps) {
  const [bg, fg] = getColors(student.name);
  const { wh, fs } = SIZE_MAP[size];
  const initials = getInitials(student.name);

  return (
    <div
      style={{
        width: wh,
        height: wh,
        minWidth: wh,
        borderRadius: '50%',
        background: bg,
        color: fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fs,
        fontWeight: 600,
        userSelect: 'none',
        flexShrink: 0,
      }}
      title={student.name}
      aria-label={student.name}
    >
      {initials}
    </div>
  );
}
