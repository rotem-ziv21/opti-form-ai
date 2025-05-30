import React from 'react';
import { useFormStore } from './store/formStore';
import { Stepper } from './components/Stepper';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RegistrationForm } from './components/RegistrationForm';
import { CampaignSettings } from './components/CampaignSettings';
import { AutomationSelection } from './components/AutomationSelection';
import { DynamicForm } from './components/DynamicForm';
import { CompletionScreen } from './components/CompletionScreen';
import { Button } from './components/ui/Button';
import { Workflow } from 'lucide-react';
import { WorkflowAnimation } from './components/WorkflowAnimation';

function App() {
  const {
    currentStep,
    selectedAutomation,
    formData,
    errors,
    isSubmitting,
    isComplete,
    selectAutomation,
    updateFormData,
    setStep,
    validateCurrentStep,
    submitForm,
    resetForm
  } = useFormStore();

  const steps = ['ברוכים הבאים', 'פרטי התקשרות', 'הגדרת קמפיינים', 'בחירת אוטומציה', 'הגדרת אוטומציה', 'סיום'];

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep === 4) {
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-background text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center">
          <Workflow size={24} className="text-primary mr-3" />
          <h1 className="text-xl font-bold">OptiOne - טופס אינטייק חכם</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!isComplete && (
            <>
              <Stepper 
                steps={steps} 
                currentStep={currentStep} 
                onStepClick={(step) => {
                  if (step < currentStep) {
                    setStep(step);
                  }
                }}
              />
              <WorkflowAnimation 
                currentStep={currentStep} 
                totalSteps={steps.length} 
              />
            </>
          )}

          <div className="mt-8 transition-all duration-300">
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
                  onSelect={selectAutomation}
                />
                {errors.automation && (
                  <p className="mt-2 text-error text-center">{errors.automation}</p>
                )}
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    חזור
                  </Button>
                  <Button onClick={handleNext}>המשך</Button>
                </div>
              </div>
            )}

            {currentStep === 4 && selectedAutomation && (
              <DynamicForm
                automation={selectedAutomation}
                formData={formData}
                setFormData={updateFormData}
                errors={errors}
              />
            )}

            {currentStep === 5 && isComplete && (
              <CompletionScreen onReset={resetForm} />
            )}
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