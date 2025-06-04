import { Outlet, Link, useLocation } from 'react-router-dom';
import { Workflow, Settings, Users, LogOut } from 'lucide-react';

export function AdminLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-background text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Workflow size={24} className="text-primary ml-3" />
            <h1 className="text-xl font-bold">OptiOne - אזור מנהל</h1>
          </div>
          <Link to="/" className="text-white hover:text-primary transition-colors">
            <LogOut size={20} className="inline ml-2" />
            חזרה לטופס
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 border-l">
          <nav className="space-y-2">
            <Link 
              to="/admin" 
              className={`flex items-center p-3 rounded-lg text-right ${
                location.pathname === '/admin' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Workflow size={20} className="ml-3" />
              <span>ניהול תהליכים</span>
            </Link>
            <Link 
              to="/admin/users" 
              className={`flex items-center p-3 rounded-lg text-right ${
                location.pathname === '/admin/users' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Users size={20} className="ml-3" />
              <span>ניהול משתמשים</span>
            </Link>
            <Link 
              to="/admin/settings" 
              className={`flex items-center p-3 rounded-lg text-right ${
                location.pathname === '/admin/settings' ? 'bg-primary text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Settings size={20} className="ml-3" />
              <span>הגדרות</span>
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <footer className="bg-slate-100 py-4 px-6 border-t">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} OptiOne CRM - כל הזכויות שמורות
        </div>
      </footer>
    </div>
  );
}
