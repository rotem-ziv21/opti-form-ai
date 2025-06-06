import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeft, Clock, Brain, PenTool as Tool, AlertTriangle } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-center mb-6">
        <img src="/Optione logo.png" alt="OptiOne Logo" className="h-24 object-contain" />
      </div>
      <Card className="text-center p-8 bg-gradient-to-br from-background/5 to-primary/5">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-background">
            👋 ברוכים הבאים לשאלון האוטומציות של OptiOne
          </h1>
          
          <p className="text-xl text-slate-700">
            🧠 המטרה: להבין איזה אוטומציות נבנה לכם – ולקבל מכם את התוכן לכל אחת מהן.
          </p>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-background mb-4 flex items-center justify-center gap-2">
              <Tool className="text-primary" />
              איך זה עובד?
            </h2>
            
            <p className="text-lg text-slate-600 mb-4">
              בכל עמוד תראו אוטומציה אחת → תכתבו את התוכן שתרצו שיופיע בה.
            </p>
            
            <p className="text-lg text-slate-600">
              בסיום – אנחנו מטמיעים את הכול עבורכם.
            </p>
            
            <p className="text-lg text-slate-600 mt-4">
              במידה ויש אוטומציה שפחות רלוונטית עבורכם פשוט תלחצו ״הבא״ ותתקדמו.
            </p>
          </div>

          <div className="bg-warning/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-background mb-4 flex items-center justify-center gap-2">
              <AlertTriangle className="text-warning" />
              שימו לב
            </h2>
            
            <ul className="space-y-3 text-lg">
              <li className="flex items-center gap-2 text-slate-700">
                <span className="text-primary">🔹</span>
                אם תצאו באמצע – המידע לא יישמר
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <span className="text-primary">🔹</span>
                <Clock size={20} className="text-slate-400" />
                ממליצים למלא ברצף (10–15 דקות גג)
              </li>
            </ul>
          </div>

          <Button 
            onClick={onNext}
            size="lg"
            className="mt-8"
            rightIcon={<ArrowLeft size={20} />}
          >
            בואו נתחיל
          </Button>
        </div>
      </Card>
    </div>
  );
};