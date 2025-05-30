import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Check, Video } from 'lucide-react';

interface CompletionScreenProps {
  onReset: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({ onReset }) => {
  useEffect(() => {
    // Trigger confetti when component mounts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto animate-fade-in">
      <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center">
        <Check className="text-success" size={32} />
      </div>
      
      <h1 className="text-3xl font-bold text-background">מעולה! הטופס נשלח בהצלחה</h1>
      <p className="text-slate-600 text-lg">
        הנתונים שלך נקלטו במערכת ויצרנו את האוטומציה עבורך. בקרוב נשלח לך אימייל עם הפרטים הבאים.
      </p>
      
      <Card className="p-8 bg-background/5">
        <h2 className="text-xl font-bold mb-4">מה הלאה?</h2>
        <p className="mb-6">
          צפה בסרטון ההדרכה שלנו כדי ללמוד כיצד להשתמש באוטומציה החדשה שלך 
          ולמקסם את היתרונות שלה עבור העסק שלך.
        </p>
        <Button 
          className="mx-auto"
          leftIcon={<Video size={18} />}
          onClick={() => window.open('https://www.youtube.com/watch?v=example', '_blank')}
        >
          צפה בהדרכת וידאו
        </Button>
      </Card>
      
      <div>
        <Button variant="outline" onClick={onReset}>
          חזור לתחילת התהליך
        </Button>
      </div>
    </div>
  );
};