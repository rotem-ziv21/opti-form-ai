import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ArrowLeft, Clock, Brain, PenTool as Tool, AlertTriangle, Sparkles, Zap, Target } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-br from-green-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full">
        <div className="container mx-auto px-6 py-8 max-w-5xl">
          <div className="space-y-10 animate-fade-in">
            {/* Logo Section */}
            <div className="text-center mb-10">
              <div className="inline-block relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/30">
                  <img src="/Optione logo.png" alt="OptiOne Logo" className="h-16 object-contain mx-auto" />
                </div>
              </div>
            </div>

            {/* Main Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Sparkles size={16} />
                <span>אוטומציות חכמות עם AI</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight px-6">
                ברוכים הבאים
              </h1>
              
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-6">
                🧠 המטרה: להבין איזה אוטומציות נבנה לכם ולקבל מכם את התוכן המושלם לכל אחת מהן
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="px-6 mb-12">
              <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                <Card className="group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                      <Brain className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">חכם ומותאם אישית</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">AI מתקדם שמבין את הצרכים הייחודיים של העסק שלכם</p>
                  </div>
                </Card>

                <Card className="group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                      <Zap className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">מהיר ויעיל</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">תהליך של 10-15 דקות בלבד ליצירת אוטומציות מושלמות</p>
                  </div>
                </Card>

                <Card className="group hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform duration-300">
                      <Target className="text-white" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">מדויק ומקצועי</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">כל אוטומציה מותאמת בדיוק לתחום ולקהל היעד שלכם</p>
                  </div>
                </Card>
              </div>
            </div>

            {/* How it works section */}
            <div className="px-6 mb-12">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden max-w-4xl mx-auto">
                <div className="relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 px-4 py-2 rounded-full mb-4">
                        <Tool className="text-slate-600" size={20} />
                        <span className="font-medium text-slate-700">איך זה עובד?</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-8 max-w-2xl mx-auto">
                      <div className="text-center group">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          1
                        </div>
                        <h3 className="font-bold text-slate-800 mb-3">בחרו אוטומציה</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">בכל עמוד תראו אוטומציה אחת המותאמת לעסק שלכם</p>
                      </div>
                      
                      <div className="text-center group">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          2
                        </div>
                        <h3 className="font-bold text-slate-800 mb-3">כתבו תוכן</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">הוסיפו את התוכן והמסרים שתרצו שיופיעו באוטומציה</p>
                      </div>
                      
                      <div className="text-center group">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                          3
                        </div>
                        <h3 className="font-bold text-slate-800 mb-3">אנחנו מטמיעים</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">בסיום, אנחנו מטמיעים את כל האוטומציות עבורכם</p>
                      </div>
                    </div>
                    
                    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                      <p className="text-center text-slate-700 font-medium">
                        💡 <strong>טיפ:</strong> במידה ויש אוטומציה שפחות רלוונטית עבורכם, פשוט לחצו "הבא" והתקדמו
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Important Notice */}
            <div className="px-6 mb-12">
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg max-w-4xl mx-auto">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="text-white" size={24} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-800 mb-3">חשוב לדעת</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-700">
                          <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                          <span>אם תצאו באמצע – המידע לא יישמר</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-700">
                          <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                          <Clock size={18} className="text-amber-600 flex-shrink-0" />
                          <span>ממליצים למלא ברצף (10–15 דקות בלבד)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* CTA Button */}
            <div className="text-center px-6 pb-12">
              <Button 
                onClick={onNext}
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-bold text-lg"
                rightIcon={<ArrowLeft size={22} className="group-hover:translate-x-1 transition-transform duration-300" />}
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={20} />
                  בואו נתחיל ליצור קסם
                </span>
              </Button>
              
              <p className="text-sm text-slate-500 mt-4">
                ⚡ תהליך מהיר ופשוט שיחסוך לכם שעות של עבודה
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};