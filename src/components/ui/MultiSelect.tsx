import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, Check, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  id: string;
  label: string;
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
  isOptional?: boolean;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  label,
  options,
  value = [],
  onChange,
  error,
  isOptional,
  placeholder = 'בחר אפשרויות...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleOption = (optionValue: string, e?: React.MouseEvent) => {
    // Prevent event bubbling if event is provided
    if (e) {
      e.stopPropagation();
    }
    
    const newValue = [...value];
    const index = newValue.indexOf(optionValue);
    
    if (index === -1) {
      // Add the option
      newValue.push(optionValue);
    } else {
      // Remove the option
      newValue.splice(index, 1);
    }
    
    // Ensure the onChange event is triggered with the updated value
    onChange(newValue);
    
    // Keep dropdown open after selection
    setTimeout(() => {
      setIsOpen(true);
    }, 0);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="form-label">
          {label}
          {!isOptional && <span className="text-error mr-1">*</span>}
        </label>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        {/* Selected options display */}
        <div
          className={cn(
            'form-input flex items-center flex-wrap min-h-[42px] cursor-pointer',
            error && 'border-error focus:border-error focus:ring-error/30'
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {value.length === 0 ? (
            <span className="text-slate-400">{placeholder}</span>
          ) : (
            <div className="flex flex-wrap gap-1">
              {value.map(val => {
                const option = options.find(opt => opt.value === val);
                return option ? (
                  <div 
                    key={val} 
                    className="bg-primary/10 text-primary rounded-md px-2 py-1 text-sm flex items-center"
                  >
                    <span>{option.label}</span>
                    <X 
                      size={14} 
                      className="ml-1 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(val);
                      }} 
                    />
                  </div>
                ) : null;
              })}
              {value.length > 0 && (
                <X 
                  size={16} 
                  className="ml-auto cursor-pointer text-slate-400 hover:text-slate-600" 
                  onClick={clearAll} 
                />
              )}
            </div>
          )}
          <ChevronDown size={18} className="ml-auto text-slate-400" />
        </div>
        
        {/* Dropdown options */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {options.map(option => (
              <div
                key={option.value}
                className={cn(
                  'flex items-center px-3 py-2 cursor-pointer hover:bg-slate-100',
                  value.includes(option.value) && 'bg-primary/5'
                )}
                onClick={(e) => toggleOption(option.value, e)}
              >
                <div className={cn(
                  'w-5 h-5 border rounded-md flex items-center justify-center mr-2',
                  value.includes(option.value) ? 'bg-primary border-primary' : 'border-slate-300'
                )}>
                  {value.includes(option.value) && <Check size={14} className="text-white" />}
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {value.length > 0 && !error && (
        <p className="mt-1 text-xs text-primary font-medium">
          נבחרו {value.length} אפשרויות
        </p>
      )}
    </div>
  );
};
