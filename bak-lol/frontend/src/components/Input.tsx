import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

interface InputGroupProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function InputGroup({ label, error, children }: InputGroupProps) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      {children}
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}

// Text input
interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TextInput({ label, error, className = '', ...rest }: TextInputProps) {
  return (
    <InputGroup label={label} error={error}>
      <input
        className={`input ${error ? 'input--error' : ''} ${className}`}
        {...rest}
      />
    </InputGroup>
  );
}

// Textarea
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function TextArea({ label, error, className = '', ...rest }: TextAreaProps) {
  return (
    <InputGroup label={label} error={error}>
      <textarea
        className={`input ${error ? 'input--error' : ''} ${className}`}
        {...rest}
      />
    </InputGroup>
  );
}

// Select
interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectInput({ label, error, options, placeholder, className = '', ...rest }: SelectInputProps) {
  return (
    <InputGroup label={label} error={error}>
      <select className={`input ${error ? 'input--error' : ''} ${className}`} {...rest}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </InputGroup>
  );
}
