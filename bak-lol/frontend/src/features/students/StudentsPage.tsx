import { useState } from 'react';
import { MOCK_STUDENTS } from '../../data/mock';
import { StudentCard } from './StudentCard';
import { FilterBar } from '../../components/FilterBar';

export function StudentsPage() {
  const [hostel, setHostel] = useState('');
  const [year, setYear] = useState('');
  const [department, setDepartment] = useState('');
  const [search, setSearch] = useState('');

  const filtered = MOCK_STUDENTS.filter((s) => {
    if (hostel && s.hostel !== hostel) return false;
    if (year && String(s.year) !== year) return false;
    if (department && s.department !== department) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <main className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p style={{ color: 'var(--color-text-soft)', fontSize: 'var(--fs-sm)', marginTop: 4 }}>
            Find and connect with fellow hostellers
          </p>
        </div>
      </div>

      <FilterBar
        hostel={hostel} year={year} department={department} search={search}
        onHostel={setHostel} onYear={setYear} onDepartment={setDepartment} onSearch={setSearch}
        showSearch
      />

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">👥</div>
          <div className="empty-state__title">No students found</div>
          <div className="empty-state__desc">Try different filters.</div>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
            {filtered.length} {filtered.length === 1 ? 'student' : 'students'} found
          </p>
          <div className="grid-auto">
            {filtered.map((s) => <StudentCard key={s.id} student={s} />)}
          </div>
        </>
      )}
    </main>
  );
}
