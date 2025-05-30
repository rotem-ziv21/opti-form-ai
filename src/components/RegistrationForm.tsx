import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FormField } from './ui/FormField';
import { ArrowLeft, Shield } from 'lucide-react';
import { useFormStore } from '../store/formStore';

interface RegistrationFormProps {
  onNext: () => void;
  onBack: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onNext, onBack }) => {
  const { formData, updateFormData, errors } = useFormStore();

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-background mb-2">פרטי התקשרות</h2>
          <p className="text-slate-600">
            לפני שנתחיל – נבקש מכם למלא כמה פרטים בסיסיים כדי שנדע למי לשייך את התשובות
          </p>
        </div>

        <div className="bg-background/5 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Shield className="text-background mt-1" size={20} />
          <p className="text-sm text-slate-600">
            🛡️ הפרטים נועדו רק לצורך התאמה של האוטומציות למערכת שלכם. לא נשתמש בהם לשום מטרה אחרת.
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            id="fullName"
            label="שם מלא"
            type="text"
            placeholder="ישראל ישראלי"
            value={formData.fullName || ''}
            onChange={(value) => updateFormData({ fullName: value })}
            error={errors.fullName}
          />
          
          <FormField
            id="phone"
            label="טלפון"
            type="text"
            placeholder="050-0000000"
            value={formData.phone || ''}
            onChange={(value) => updateFormData({ phone: value })}
            error={errors.phone}
          />
          
          <FormField
            id="email"
            label="דוא״ל"
            type="email"
            placeholder="your@email.com"
            value={formData.email || ''}
            onChange={(value) => updateFormData({ email: value })}
            error={errors.email}
          />
          
          <FormField
            id="businessName"
            label="שם העסק"
            type="text"
            placeholder="שם העסק שלך"
            value={formData.businessName || ''}
            onChange={(value) => updateFormData({ businessName: value })}
            error={errors.businessName}
          />
        </div>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={onBack}>
            חזור
          </Button>
          <Button onClick={onNext} rightIcon={<ArrowLeft size={20} />}>
            המשך לבחירת אוטומציות
          </Button>
        </div>
      </Card>
    </div>
  );
};