import { HOSTELS, DEPARTMENTS } from '../types';

interface FilterBarProps {
  hostel: string;
  year: string;
  department: string;
  search?: string;
  onHostel: (v: string) => void;
  onYear: (v: string) => void;
  onDepartment: (v: string) => void;
  onSearch?: (v: string) => void;
  showYear?: boolean;
  showDept?: boolean;
  showSearch?: boolean;
}

export function FilterBar({
  hostel, year, department, search = '',
  onHostel, onYear, onDepartment, onSearch,
  showYear = true, showDept = true, showSearch = false,
}: FilterBarProps) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-3)',
      marginBottom: 'var(--space-6)',
      alignItems: 'center',
    }}>
      {showSearch && onSearch && (
        <input
          className="input"
          style={{ maxWidth: 220 }}
          placeholder="🔍  Search by name..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      )}

      <select className="input" style={{ maxWidth: 180 }} value={hostel} onChange={(e) => onHostel(e.target.value)}>
        <option value="">All Hostels</option>
        {HOSTELS.map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>

      {showYear && (
        <select className="input" style={{ maxWidth: 130 }} value={year} onChange={(e) => onYear(e.target.value)}>
          <option value="">All Years</option>
          {[1, 2, 3, 4].map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
      )}

      {showDept && (
        <select className="input" style={{ maxWidth: 200 }} value={department} onChange={(e) => onDepartment(e.target.value)}>
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      )}

      {(hostel || year || department || search) && (
        <button
          className="btn btn--ghost btn--sm"
          onClick={() => {
            onHostel(''); onYear(''); onDepartment('');
            if (onSearch) onSearch('');
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
