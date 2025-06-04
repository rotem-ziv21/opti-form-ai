import { useState } from 'react';
import { WorkflowDashboard } from './WorkflowDashboard';
import { WorkflowManagement } from './WorkflowManagement';
import { LayoutGrid, List } from 'lucide-react';

export function AdminDashboard() {
  const [viewMode, setViewMode] = useState<'dashboard' | 'table'>('dashboard');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-background">לוח בקרה</h2>
        
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            className={`flex items-center px-3 py-2 rounded-md ${
              viewMode === 'dashboard' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('dashboard')}
          >
            <LayoutGrid size={18} className="ml-2" />
            דאשבורד
          </button>
          <button
            className={`flex items-center px-3 py-2 rounded-md ${
              viewMode === 'table' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setViewMode('table')}
          >
            <List size={18} className="ml-2" />
            טבלה
          </button>
        </div>
      </div>
      
      {viewMode === 'dashboard' ? (
        <WorkflowDashboard />
      ) : (
        <WorkflowManagement />
      )}
    </div>
  );
}
