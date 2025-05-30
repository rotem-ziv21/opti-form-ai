import React from 'react';
import { cn } from '../../lib/utils';
import { Edit } from 'lucide-react';
import { Button } from './Button';

interface FormFieldProps {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'number' | 'email' | 'url';
  placeholder?: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options?: { value: string; label: string }[];
  error?: string;
  supportAI?: boolean;
  onGenerateAI?: () => void;
  isOptional?: boolean;
  isMultiple?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  options,
  error,
  supportAI,
  onGenerateAI,
  isOptional,
  isMultiple
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="form-label">
          {label}
          {!isOptional && <span className="text-error mr-1">*</span>}
        </label>
        {supportAI && onGenerateAI && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onGenerateAI}
            className="text-xs"
            leftIcon={<Edit size={14} />}
          >
            כתוב עם AI
          </Button>
        )}
      </div>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'form-textarea',
            error && 'border-error focus:border-error focus:ring-error/30'
          )}
        />
      ) : type === 'select' ? (
        <select
          id={id}
          value={isMultiple ? (value as string[]) : (value as string)}
          onChange={(e) => {
            if (isMultiple) {
              const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
              onChange(selectedOptions);
            } else {
              onChange(e.target.value);
            }
          }}
          multiple={isMultiple}
          size={isMultiple ? 8 : undefined}
          className={cn(
            'form-select',
            isMultiple && 'min-h-[200px]',
            error && 'border-error focus:border-error focus:ring-error/30'
          )}
        >
          {!isMultiple && <option value="">בחר...</option>}
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            'form-input',
            error && 'border-error focus:border-error focus:ring-error/30'
          )}
        />
      )}
      
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {isOptional && !error && (
        <p className="mt-1 text-sm text-slate-500">שדה זה אינו חובה</p>
      )}
      {isMultiple && !error && (
        <p className="mt-1 text-sm text-slate-500">ניתן לבחור מספר אפשרויות (לחיצה על Ctrl/Cmd)</p>
      )}
    </div>
  );
};