import { useState } from 'react';
import { Users, UserPlus, Mail, Phone, Building } from 'lucide-react';

export function UserManagement() {
  const [users] = useState([
    { id: 1, name: 'ישראל ישראלי', email: 'israel@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'שרה כהן', email: 'sarah@example.com', role: 'implementer', status: 'active' },
    { id: 3, name: 'יוסי לוי', email: 'yossi@example.com', role: 'viewer', status: 'inactive' },
  ]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-background">ניהול משתמשים</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary/90 transition-colors">
          <UserPlus size={18} className="ml-2" />
          משתמש חדש
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">שם</th>
              <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">דוא"ל</th>
              <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">תפקיד</th>
              <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">סטטוס</th>
              <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Users size={18} />
                    </div>
                    <div className="mr-3">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-400 ml-2" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === 'implementer'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role === 'admin' ? 'מנהל' : user.role === 'implementer' ? 'מיישם' : 'צופה'}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status === 'active' ? 'פעיל' : 'לא פעיל'}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex space-x-2 space-x-reverse">
                    <button className="text-blue-500 hover:text-blue-700">
                      ערוך
                    </button>
                    <span className="text-gray-300 mx-2">|</span>
                    <button className="text-red-500 hover:text-red-700">
                      מחק
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">פרטי התקשרות</h3>
        <div className="bg-gray-50 p-6 rounded-lg border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Building size={20} className="text-primary ml-2" />
                <h4 className="font-medium">פרטי החברה</h4>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">שם החברה:</span> OptiOne CRM</p>
                <p><span className="font-medium">כתובת:</span> רחוב הברזל 38, תל אביב</p>
                <p><span className="font-medium">מיקוד:</span> 6971052</p>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Mail size={20} className="text-primary ml-2" />
                <h4 className="font-medium">פרטי קשר</h4>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">דוא"ל:</span> support@optione.co.il</p>
                <p className="flex items-center">
                  <Phone size={16} className="text-primary ml-2" />
                  <span className="font-medium ml-1">טלפון:</span> 03-1234567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
