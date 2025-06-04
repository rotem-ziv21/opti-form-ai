import { useState, useEffect } from 'react';
import { getActiveWorkflows, updateActiveWorkflowStatus } from '../../lib/supabase';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  PlayCircle, 
  XCircle,
  Search,
  Filter
} from 'lucide-react';

// סטטוסים אפשריים לתהליך
type WorkflowStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

// ממשק לנתוני תהליך
interface Workflow {
  id: string;
  created_at: string;
  client_id: string;
  automation_name: string;
  automation_title: string;
  automation_type: string;
  status: WorkflowStatus;
  action_config: any;
  business_name?: string; // שם העסק מתוך action_config
}

export function WorkflowManagement() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

  // טעינת נתוני התהליכים
  useEffect(() => {
    async function loadWorkflows() {
      try {
        setLoading(true);
        const data = await getActiveWorkflows();
        
        // עיבוד נתונים - הוספת שם העסק מתוך action_config
        const processedData = data.map((workflow: any) => {
          let businessName = '';
          
          // ניסיון לחלץ את שם העסק מתוך action_config
          if (workflow.action_config && workflow.action_config.form_inputs) {
            businessName = workflow.action_config.form_inputs.business_name || '';
          }
          
          return {
            ...workflow,
            business_name: businessName
          };
        });
        
        setWorkflows(processedData);
        setError(null);
      } catch (err) {
        console.error('Error loading workflows:', err);
        setError('אירעה שגיאה בטעינת הנתונים');
      } finally {
        setLoading(false);
      }
    }
    
    loadWorkflows();
  }, []);

  // עדכון סטטוס תהליך
  const handleStatusChange = async (id: string, newStatus: WorkflowStatus) => {
    try {
      await updateActiveWorkflowStatus(id, newStatus);
      
      // עדכון הסטטוס בממשק
      setWorkflows(workflows.map(workflow => 
        workflow.id === id ? { ...workflow, status: newStatus } : workflow
      ));
    } catch (err) {
      console.error('Error updating workflow status:', err);
      setError('אירעה שגיאה בעדכון הסטטוס');
    }
  };

  // פונקציית סינון לפי חיפוש וסטטוס
  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = 
      workflow.automation_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.automation_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (workflow.business_name && workflow.business_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // פונקציה להצגת אייקון סטטוס
  const getStatusIcon = (status: WorkflowStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-yellow-500" />;
      case 'in_progress':
        return <PlayCircle className="text-blue-500" />;
      case 'completed':
        return <CheckCircle className="text-green-500" />;
      case 'cancelled':
        return <XCircle className="text-red-500" />;
      default:
        return <AlertCircle className="text-gray-500" />;
    }
  };

  // פונקציה להצגת שם הסטטוס בעברית
  const getStatusName = (status: WorkflowStatus) => {
    switch (status) {
      case 'pending':
        return 'ממתין';
      case 'in_progress':
        return 'בתהליך';
      case 'completed':
        return 'הושלם';
      case 'cancelled':
        return 'בוטל';
      default:
        return 'לא ידוע';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-background">ניהול תהליכים</h2>
      
      {/* סרגל חיפוש וסינון */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full p-3 pr-10 text-right border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="חיפוש לפי שם תהליך או עסק..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Filter size={18} className="text-gray-400" />
          </div>
          <select
            className="block w-full p-3 pr-10 text-right border border-gray-300 rounded-lg focus:ring-primary focus:border-primary appearance-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
          >
            <option value="all">כל הסטטוסים</option>
            <option value="pending">ממתין</option>
            <option value="in_progress">בתהליך</option>
            <option value="completed">הושלם</option>
            <option value="cancelled">בוטל</option>
          </select>
        </div>
      </div>
      
      {/* הצגת שגיאה */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* מצב טעינה */}
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-3">טוען נתונים...</p>
        </div>
      ) : (
        <>
          {/* תצוגת תהליכים */}
          {filteredWorkflows.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <p>לא נמצאו תהליכים מתאימים</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">סטטוס</th>
                    <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">שם העסק</th>
                    <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">סוג אוטומציה</th>
                    <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">שם האוטומציה</th>
                    <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">תאריך יצירה</th>
                    <th className="py-3 px-4 text-right font-medium text-gray-500 uppercase tracking-wider">פעולות</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWorkflows.map((workflow) => (
                    <tr key={workflow.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(workflow.status)}
                          <span className="mr-2">{getStatusName(workflow.status)}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {workflow.business_name || '-'}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {workflow.automation_type}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {workflow.automation_title}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {new Date(workflow.created_at).toLocaleDateString('he-IL')}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex space-x-2 space-x-reverse">
                          {workflow.status !== 'pending' && (
                            <button
                              onClick={() => handleStatusChange(workflow.id, 'pending')}
                              className="text-yellow-500 hover:text-yellow-700"
                              title="סמן כממתין"
                            >
                              <Clock size={20} />
                            </button>
                          )}
                          {workflow.status !== 'in_progress' && (
                            <button
                              onClick={() => handleStatusChange(workflow.id, 'in_progress')}
                              className="text-blue-500 hover:text-blue-700"
                              title="סמן כבתהליך"
                            >
                              <PlayCircle size={20} />
                            </button>
                          )}
                          {workflow.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusChange(workflow.id, 'completed')}
                              className="text-green-500 hover:text-green-700"
                              title="סמן כהושלם"
                            >
                              <CheckCircle size={20} />
                            </button>
                          )}
                          {workflow.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatusChange(workflow.id, 'cancelled')}
                              className="text-red-500 hover:text-red-700"
                              title="סמן כבוטל"
                            >
                              <XCircle size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
