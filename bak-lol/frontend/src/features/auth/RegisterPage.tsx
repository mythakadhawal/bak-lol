import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { TextInput, TextArea, SelectInput } from '../../components/Input';
import { HOSTELS, DEPARTMENTS, YEARS } from '../../types';
import { demoLogin } from '../../store/authStore';

interface FormData {
  name: string;
  year: string;
  department: string;
  hostel: string;
  email: string;
  ug_number: string;
  password: string;
  confirm_password: string;
  bio: string;
}

const INITIAL: FormData = {
  name: '', year: '', department: '', hostel: '',
  email: '', ug_number: '', password: '', confirm_password: '', bio: '',
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isFirstYear = form.year === '1';

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.year || !form.department || !form.hostel || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isFirstYear && !form.email) {
      setError('College email is required for 2nd year and above.');
      return;
    }
    if (isFirstYear && !form.email && !form.ug_number) {
      setError('Please provide either your college email or UG number.');
      return;
    }
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    // Demo: just log in
    demoLogin();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: 'var(--space-8) var(--space-6)',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '2rem' }}>🌿</span>
            <span style={{ display: 'block', fontWeight: 700, fontSize: 'var(--fs-2xl)', color: 'var(--color-primary)' }}>Bak-Lol</span>
          </Link>
        </div>

        <div className="card" style={{ padding: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--fs-xl)', fontWeight: 600, marginBottom: 'var(--space-6)' }}>
            Create your account
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <TextInput id="reg-name" label="Full Name *" placeholder="Your full name" value={form.name} onChange={set('name')} />

            <div className="grid-2" style={{ gap: 'var(--space-3)' }}>
              <SelectInput
                id="reg-year"
                label="Year *"
                value={form.year}
                onChange={set('year')}
                placeholder="Select year"
                options={YEARS.map((y) => ({ value: String(y), label: `Year ${y}` }))}
              />
              <SelectInput
                id="reg-dept"
                label="Department *"
                value={form.department}
                onChange={set('department')}
                placeholder="Select dept"
                options={DEPARTMENTS.map((d) => ({ value: d, label: d }))}
              />
            </div>

            <SelectInput
              id="reg-hostel"
              label="Hostel *"
              value={form.hostel}
              onChange={set('hostel')}
              placeholder="Select your hostel"
              options={HOSTELS.map((h) => ({ value: h, label: h }))}
            />

            <TextInput
              id="reg-email"
              label={`College Email ${isFirstYear ? '(optional if you have UG number)' : '*'}`}
              type="email"
              placeholder="yourname@college.edu"
              value={form.email}
              onChange={set('email')}
            />

            {isFirstYear && (
              <TextInput
                id="reg-ug"
                label="UG / Enrollment Number (optional)"
                placeholder="e.g. UG240001"
                value={form.ug_number}
                onChange={set('ug_number')}
              />
            )}

            <TextArea
              id="reg-bio"
              label="Short Bio (optional)"
              placeholder="What are you into? Looking for?"
              value={form.bio}
              onChange={set('bio')}
              style={{ minHeight: 70 }}
            />

            <TextInput id="reg-password" label="Password *" type="password" placeholder="Create a password" value={form.password} onChange={set('password')} />
            <TextInput id="reg-confirm" label="Confirm Password *" type="password" placeholder="Re-enter password" value={form.confirm_password} onChange={set('confirm_password')} />

            {error && (
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--color-danger)', background: 'rgba(176,92,92,0.08)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)' }}>
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Create account
            </Button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 'var(--fs-sm)', color: 'var(--color-text-soft)', marginTop: 'var(--space-5)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
