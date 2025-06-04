import { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Database, Key, Bell } from 'lucide-react';

export function Settings() {
  const [formData, setFormData] = useState({
    apiKey: '••••••••••••••••••••••••••',
    notificationsEnabled: true,
    emailNotifications: true,
    automationLimit: 50,
    defaultStatus: 'pending',
    debugMode: false,
    language: 'he',
    theme: 'tech-ui'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // כאן תהיה הלוגיקה לשמירת ההגדרות
    console.log('Settings saved:', formData);
    // הצגת הודעת הצלחה
    alert('ההגדרות נשמרו בהצלחה');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <SettingsIcon size={24} className="text-primary ml-3" />
        <h2 className="text-2xl font-bold text-background">הגדרות מערכת</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* הגדרות API */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <Key size={20} className="text-primary ml-2" />
              <h3 className="text-lg font-semibold text-gray-700">הגדרות API</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                  מפתח OpenAI API
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="apiKey"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-right"
                  />
                  <button
                    type="button"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                    onClick={() => alert('הצג מפתח API')}
                  >
                    הצג
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  מפתח ה-API משמש לתקשורת עם שירותי OpenAI
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="debugMode"
                  name="debugMode"
                  checked={formData.debugMode}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ml-2"
                />
                <label htmlFor="debugMode" className="text-sm text-gray-700">
                  הפעל מצב דיבאג
                </label>
              </div>
            </div>
          </div>
          
          {/* הגדרות מסד נתונים */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <Database size={20} className="text-primary ml-2" />
              <h3 className="text-lg font-semibold text-gray-700">הגדרות מסד נתונים</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="automationLimit" className="block text-sm font-medium text-gray-700 mb-1">
                  מגבלת אוטומציות פעילות
                </label>
                <input
                  type="number"
                  id="automationLimit"
                  name="automationLimit"
                  value={formData.automationLimit}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                  min="1"
                  max="1000"
                />
              </div>
              
              <div>
                <label htmlFor="defaultStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  סטטוס ברירת מחדל לתהליכים חדשים
                </label>
                <select
                  id="defaultStatus"
                  name="defaultStatus"
                  value={formData.defaultStatus}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                >
                  <option value="pending">ממתין</option>
                  <option value="in_progress">בתהליך</option>
                  <option value="completed">הושלם</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* הגדרות התראות */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <Bell size={20} className="text-primary ml-2" />
              <h3 className="text-lg font-semibold text-gray-700">הגדרות התראות</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notificationsEnabled"
                  name="notificationsEnabled"
                  checked={formData.notificationsEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ml-2"
                />
                <label htmlFor="notificationsEnabled" className="text-sm text-gray-700">
                  הפעל התראות מערכת
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded ml-2"
                />
                <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                  שלח התראות בדוא"ל
                </label>
              </div>
            </div>
          </div>
          
          {/* הגדרות ממשק */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <div className="flex items-center mb-4">
              <SettingsIcon size={20} className="text-primary ml-2" />
              <h3 className="text-lg font-semibold text-gray-700">הגדרות ממשק</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                  שפת ממשק
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                >
                  <option value="he">עברית</option>
                  <option value="en">אנגלית</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
                  ערכת נושא
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-right"
                >
                  <option value="tech-ui">Tech UI</option>
                  <option value="modern-theme">Modern Theme</option>
                  <option value="premium-ui">Premium UI</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4 space-x-reverse">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            onClick={() => setFormData({
              apiKey: '••••••••••••••••••••••••••',
              notificationsEnabled: true,
              emailNotifications: true,
              automationLimit: 50,
              defaultStatus: 'pending',
              debugMode: false,
              language: 'he',
              theme: 'tech-ui'
            })}
          >
            <RefreshCw size={18} className="ml-2" />
            איפוס
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center"
          >
            <Save size={18} className="ml-2" />
            שמור הגדרות
          </button>
        </div>
      </form>
    </div>
  );
}
