import { Link } from 'react-router-dom';
import { Student } from '../../types';
import { Avatar } from '../../components/Avatar';
import { Tag } from '../../components/Badge';
import { Button } from '../../components/Button';

interface StudentCardProps {
  student: Student;
  showMessage?: boolean;
}

export function StudentCard({ student, showMessage = true }: StudentCardProps) {
  return (
    <div className="card card--hover" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <div className="flex items-center gap-3">
        <Avatar student={student} size="lg" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to={`/profile/${student.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ fontWeight: 600, fontSize: 'var(--fs-base)', color: 'var(--color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {student.name}
            </div>
          </Link>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--color-text-muted)', marginTop: 2 }}>
            Year {student.year} · {student.department}
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Tag>{student.hostel}</Tag>
      </div>

      {student.bio && (
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', lineHeight: 'var(--lh-snug)', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {student.bio}
        </p>
      )}

      {showMessage && (
        <div style={{ marginTop: 'auto' }}>
          <Link to={`/profile/${student.id}`}>
            <Button variant="ghost" size="sm" style={{ width: '100%' }}>View Profile</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
