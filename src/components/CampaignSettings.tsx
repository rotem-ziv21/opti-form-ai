import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { FormField } from './ui/FormField';
import { ArrowLeft, Shield } from 'lucide-react';

interface CampaignSettingsProps {
  formData: Record<string, string | string[]>;
  updateFormData: (data: Record<string, string | string[]>) => void;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
}

export const CampaignSettings: React.FC<CampaignSettingsProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onBack
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-background mb-2">הגדרת מקורות קמפיין</h2>
          <p className="text-slate-600">
            בחר את הקמפיינים הפעילים והגדר את הפרמטרים שלהם
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            id="active_campaigns"
            label="קמפיינים פעילים"
            type="select"
            isMultiple={true}
            options={[
              { value: 'facebook_instagram', label: 'קמפיין לידים פייסבוק אינסטגרם' },
              { value: 'tiktok', label: 'קמפיין לידים טיקטוק' },
              { value: 'whatsapp', label: 'קמפיין הודעות ווטצאפ' },
              { value: 'landing_page', label: 'קמפיין דף נחיתה' },
              { value: 'calls', label: 'קמפיין שיחות' },
              { value: 'linkedin', label: 'קמפיין לינקדין' },
              { value: 'website', label: 'אתר' },
              { value: 'other', label: 'אחר' }
            ]}
            value={formData.active_campaigns || []}
            onChange={(value) => updateFormData({ active_campaigns: value })}
            error={errors.active_campaigns}
          />

          <FormField
            id="website_url"
            label="כתובת אתר העסק"
            type="url"
            placeholder="https://www.example.com"
            value={formData.website_url || ''}
            onChange={(value) => updateFormData({ website_url: value })}
            error={errors.website_url}
            isOptional={true}
          />

          <FormField
            id="website_credentials"
            label="פרטי כניסה לאתר"
            type="textarea"
            placeholder="שם משתמש וסיסמה לאתר (אם רלוונטי)"
            value={formData.website_credentials || ''}
            onChange={(value) => updateFormData({ website_credentials: value })}
            error={errors.website_credentials}
            isOptional={true}
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