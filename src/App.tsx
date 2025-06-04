// React is automatically imported by JSX transform
import { useFormStore } from './store/formStore';
import { Stepper } from './components/Stepper';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationForm } from './components/RegistrationForm';
import { CampaignSettings } from './components/CampaignSettings';
import { AutomationSelection } from './components/AutomationSelection';
import { CompletionScreen } from './components/CompletionScreen';
import { Workflow, CheckCircle, BarChart, Zap } from 'lucide-react';
import { AIFix } from './components/AIFix';

function App() {
  const {
    currentStep,
    selectedAutomation,
    formData,
    errors,
    isComplete,
    updateFormData,
    setStep,
    validateCurrentStep,
    submitForm,
    resetForm
  } = useFormStore();

  const steps = ['ברוכים הבאים', 'פרטי התקשרות', 'הגדרת קמפיינים', 'בחירת אוטומציה', 'סיום'];

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 3) {
        submitForm();
      } else {
        setStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    setStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* AI Fix - this component will inject AI buttons into textareas */}
      <AIFix />
      
      <header className="bg-gradient-to-r from-background to-background/90 text-white py-5 px-6 shadow-lg">
        <div className="container mx-auto flex items-center">
          <div className="flex items-center">
            <div className="bg-primary/20 p-2 rounded-full mr-3">
              <Workflow size={24} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-white to-gray-300">OptiOne - טופס אינטייק חכם</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 py-10 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto">
          {/* Hero section for welcome page */}
          {currentStep === 0 && (
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-background mb-4">ברוכים הבאים למערכת האוטומציה החכמה</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">צור תהליכי שיווק אוטומטיים בקלות ובמהירות עם המערכת החכמה שלנו</p>
              <div className="flex justify-center space-x-4 space-x-reverse">
                <div className="flex items-center bg-background/5 p-3 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full ml-3">
                    <Zap size={20} className="text-primary" />
                  </div>
                  <span>אוטומציה מתקדמת</span>
                </div>
                <div className="flex items-center bg-background/5 p-3 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full ml-3">
                    <CheckCircle size={20} className="text-primary" />
                  </div>
                  <span>יצירת תוכן AI</span>
                </div>
                <div className="flex items-center bg-background/5 p-3 rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full ml-3">
                    <BarChart size={20} className="text-primary" />
                  </div>
                  <span>ניתוח ביצועים</span>
                </div>
              </div>
            </div>
          )}

          {/* Form content with modern styling */}
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Step indicator */}
            <div className="bg-gray-50 p-4 border-b border-gray-100">
              <Stepper 
                steps={steps} 
                currentStep={currentStep} 
                onStepClick={(step) => {
                  if (step < currentStep) {
                    setStep(step);
                  }
                }}
              />
            </div>
            
            {/* Step content */}
            <div className="p-8">
              {currentStep === 0 && (
                <WelcomeScreen onNext={handleNext} />
              )}

              {currentStep === 1 && (
                <RegistrationForm 
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 2 && (
                <CampaignSettings
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 3 && (
                <div>
                  <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-background mb-2">בחר אוטומציה</h2>
                    <p className="text-slate-600">
                      בחר את האוטומציה שברצונך להגדיר מתוך הרשימה הבאה
                    </p>
                  </div>
                  <AutomationSelection
                    selectedAutomation={selectedAutomation}
                  />
                  {errors.automation && (
                    <p className="mt-2 text-error text-center">{errors.automation}</p>
                  )}
                </div>
              )}

              {currentStep === 4 && isComplete && (
                <CompletionScreen onReset={resetForm} />
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-100 py-4 px-6 border-t">
        <div className="container mx-auto text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} OptiOne CRM - כל הזכויות שמורות
        </div>
      </footer>
    </div>
  );
}

export default App;