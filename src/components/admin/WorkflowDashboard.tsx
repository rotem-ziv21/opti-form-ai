import { useState, useEffect } from 'react';
import { getActiveWorkflows } from '../../lib/supabase';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  PlayCircle, 
  XCircle,
  PieChart,
  BarChart
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
}

// ממשק לנתוני סיכום
interface StatusSummary {
  pending: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  total: number;
}

// ממשק לנתוני סיכום לפי סוג אוטומציה
interface TypeSummary {
  [key: string]: number;
}

export function WorkflowDashboard() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusSummary, setStatusSummary] = useState<StatusSummary>({
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0,
    total: 0
  });
  const [typeSummary, setTypeSummary] = useState<TypeSummary>({});

  // טעינת נתוני התהליכים
  useEffect(() => {
    async function loadWorkflows() {
      try {
        setLoading(true);
        const data = await getActiveWorkflows();
        setWorkflows(data);
        
        // חישוב סיכום לפי סטטוס
        const summary: StatusSummary = {
          pending: 0,
          in_progress: 0,
          completed: 0,
          cancelled: 0,
          total: data.length
        };
        
        // חישוב סיכום לפי סוג אוטומציה
        const typeCount: TypeSummary = {};
        
        data.forEach((workflow: any) => {
          // ספירת סטטוסים
          if (workflow.status) {
            summary[workflow.status as WorkflowStatus]++;
          } else {
            summary.pending++; // ברירת מחדל אם אין סטטוס
          }
          
          // ספירת סוגי אוטומציה
          const type = workflow.automation_type || 'general';
          typeCount[type] = (typeCount[type] || 0) + 1;
        });
        
        setStatusSummary(summary);
        setTypeSummary(typeCount);
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

  // פונקציה להצגת שם סוג האוטומציה בעברית
  const getTypeName = (type: string) => {
    switch (type) {
      case 'instagram':
        return 'אינסטגרם';
      case 'facebook':
        return 'פייסבוק';
      case 'whatsapp':
        return 'וואטסאפ';
      case 'meetings':
        return 'פגישות';
      case 'call_center':
        return 'מוקד טלפוני';
      case 'general':
        return 'כללי';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-background">דאשבורד תהליכים</h2>
      
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
          {/* כרטיסי סיכום */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">סה"כ תהליכים</h3>
              <p className="text-3xl font-bold text-background">{statusSummary.total}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-yellow-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">ממתינים</h3>
                <Clock className="text-yellow-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-yellow-600">{statusSummary.pending}</p>
              <p className="text-sm text-gray-500 mt-2">
                {statusSummary.total > 0 
                  ? `${Math.round((statusSummary.pending / statusSummary.total) * 100)}%` 
                  : '0%'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-blue-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">בתהליך</h3>
                <PlayCircle className="text-blue-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-blue-600">{statusSummary.in_progress}</p>
              <p className="text-sm text-gray-500 mt-2">
                {statusSummary.total > 0 
                  ? `${Math.round((statusSummary.in_progress / statusSummary.total) * 100)}%` 
                  : '0%'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-green-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">הושלמו</h3>
                <CheckCircle className="text-green-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-green-600">{statusSummary.completed}</p>
              <p className="text-sm text-gray-500 mt-2">
                {statusSummary.total > 0 
                  ? `${Math.round((statusSummary.completed / statusSummary.total) * 100)}%` 
                  : '0%'}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-r-4 border-red-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">בוטלו</h3>
                <XCircle className="text-red-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-red-600">{statusSummary.cancelled}</p>
              <p className="text-sm text-gray-500 mt-2">
                {statusSummary.total > 0 
                  ? `${Math.round((statusSummary.cancelled / statusSummary.total) * 100)}%` 
                  : '0%'}
              </p>
            </div>
          </div>
          
          {/* תצוגת תהליכים לפי סטטוס - מעין קנבן בורד */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">מעקב תהליכים</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* עמודת ממתינים */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b bg-yellow-50 rounded-t-lg flex items-center">
                  <Clock className="text-yellow-500 ml-2" />
                  <h4 className="font-semibold">ממתינים ({workflows.filter(w => w.status === 'pending').length})</h4>
                </div>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {workflows
                    .filter(workflow => workflow.status === 'pending')
                    .map(workflow => (
                      <div key={workflow.id} className="p-3 border-b hover:bg-gray-50">
                        <h5 className="font-medium">{workflow.automation_title}</h5>
                        <p className="text-sm text-gray-500">{workflow.automation_type}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(workflow.created_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    ))}
                  {workflows.filter(w => w.status === 'pending').length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <p>אין תהליכים ממתינים</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* עמודת בתהליך */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b bg-blue-50 rounded-t-lg flex items-center">
                  <PlayCircle className="text-blue-500 ml-2" />
                  <h4 className="font-semibold">בתהליך ({workflows.filter(w => w.status === 'in_progress').length})</h4>
                </div>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {workflows
                    .filter(workflow => workflow.status === 'in_progress')
                    .map(workflow => (
                      <div key={workflow.id} className="p-3 border-b hover:bg-gray-50">
                        <h5 className="font-medium">{workflow.automation_title}</h5>
                        <p className="text-sm text-gray-500">{workflow.automation_type}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(workflow.created_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    ))}
                  {workflows.filter(w => w.status === 'in_progress').length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <p>אין תהליכים בעבודה</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* עמודת הושלמו */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b bg-green-50 rounded-t-lg flex items-center">
                  <CheckCircle className="text-green-500 ml-2" />
                  <h4 className="font-semibold">הושלמו ({workflows.filter(w => w.status === 'completed').length})</h4>
                </div>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {workflows
                    .filter(workflow => workflow.status === 'completed')
                    .map(workflow => (
                      <div key={workflow.id} className="p-3 border-b hover:bg-gray-50">
                        <h5 className="font-medium">{workflow.automation_title}</h5>
                        <p className="text-sm text-gray-500">{workflow.automation_type}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(workflow.created_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    ))}
                  {workflows.filter(w => w.status === 'completed').length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <p>אין תהליכים שהושלמו</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* עמודת בוטלו */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b bg-red-50 rounded-t-lg flex items-center">
                  <XCircle className="text-red-500 ml-2" />
                  <h4 className="font-semibold">בוטלו ({workflows.filter(w => w.status === 'cancelled').length})</h4>
                </div>
                <div className="p-2 max-h-[400px] overflow-y-auto">
                  {workflows
                    .filter(workflow => workflow.status === 'cancelled')
                    .map(workflow => (
                      <div key={workflow.id} className="p-3 border-b hover:bg-gray-50">
                        <h5 className="font-medium">{workflow.automation_title}</h5>
                        <p className="text-sm text-gray-500">{workflow.automation_type}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(workflow.created_at).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    ))}
                  {workflows.filter(w => w.status === 'cancelled').length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <p>אין תהליכים שבוטלו</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* סיכום לפי סוג אוטומציה */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <PieChart className="text-primary ml-2" size={20} />
                <h3 className="text-xl font-semibold text-gray-700">התפלגות לפי סוג אוטומציה</h3>
              </div>
              <div className="space-y-4">
                {Object.entries(typeSummary).map(([type, count]) => (
                  <div key={type} className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                      <div 
                        className="bg-primary h-4 rounded-full" 
                        style={{ width: `${Math.round((count / statusSummary.total) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="min-w-[100px] text-right">
                      <span className="text-sm font-medium">{getTypeName(type)}</span>
                      <span className="text-xs text-gray-500 mr-2">
                        ({count} - {Math.round((count / statusSummary.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <BarChart className="text-primary ml-2" size={20} />
                <h3 className="text-xl font-semibold text-gray-700">סיכום סטטוסים</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-yellow-500 h-4 rounded-full" 
                      style={{ width: `${Math.round((statusSummary.pending / statusSummary.total) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="min-w-[100px] text-right">
                    <span className="text-sm font-medium">ממתינים</span>
                    <span className="text-xs text-gray-500 mr-2">
                      ({statusSummary.pending} - {Math.round((statusSummary.pending / statusSummary.total) * 100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-blue-500 h-4 rounded-full" 
                      style={{ width: `${Math.round((statusSummary.in_progress / statusSummary.total) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="min-w-[100px] text-right">
                    <span className="text-sm font-medium">בתהליך</span>
                    <span className="text-xs text-gray-500 mr-2">
                      ({statusSummary.in_progress} - {Math.round((statusSummary.in_progress / statusSummary.total) * 100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-green-500 h-4 rounded-full" 
                      style={{ width: `${Math.round((statusSummary.completed / statusSummary.total) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="min-w-[100px] text-right">
                    <span className="text-sm font-medium">הושלמו</span>
                    <span className="text-xs text-gray-500 mr-2">
                      ({statusSummary.completed} - {Math.round((statusSummary.completed / statusSummary.total) * 100)}%)
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className="bg-red-500 h-4 rounded-full" 
                      style={{ width: `${Math.round((statusSummary.cancelled / statusSummary.total) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="min-w-[100px] text-right">
                    <span className="text-sm font-medium">בוטלו</span>
                    <span className="text-xs text-gray-500 mr-2">
                      ({statusSummary.cancelled} - {Math.round((statusSummary.cancelled / statusSummary.total) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
