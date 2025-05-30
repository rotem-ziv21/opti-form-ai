import React from 'react';
import { Automation, automations } from '../data/automations';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/Card';
import { Icons } from '../lib/icons';
import { ArrowDown } from 'lucide-react';

interface AutomationSelectionProps {
  selectedAutomation: Automation | null;
  onSelect: (automation: Automation) => void;
}

export const AutomationSelection: React.FC<AutomationSelectionProps> = ({
  selectedAutomation,
  onSelect
}) => {
  // Group automations by category
  const automationsByCategory = automations.reduce<Record<string, Automation[]>>((acc, automation) => {
    if (!acc[automation.category]) {
      acc[automation.category] = [];
    }
    acc[automation.category].push(automation);
    return acc;
  }, {});

  // Category labels in Hebrew
  const categoryLabels: Record<string, string> = {
    leads: 'לידים',
    sales: 'מכירות',
    clients: 'לקוחות',
    marketing: 'שיווק'
  };

  // Category order
  const categoryOrder = ['leads', 'sales', 'clients', 'marketing'];

  return (
    <div className="space-y-8 animate-fade-in">
      {categoryOrder.map(category => {
        const categoryAutomations = automationsByCategory[category];
        if (!categoryAutomations?.length) return null;

        return (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-bold text-background">{categoryLabels[category]}</h2>
            <div className="grid grid-cols-1 gap-4">
              {categoryAutomations.map((automation, index) => {
                const IconComponent = Icons[automation.icon as keyof typeof Icons];
                const isSelected = selectedAutomation?.id === automation.id;
                
                return (
                  <div key={automation.id} className="relative">
                    <Card 
                      highlight={isSelected}
                      className={`cursor-pointer hover:shadow-md transition-all ${isSelected ? 'border-primary' : ''}`}
                      onClick={() => onSelect(automation)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {IconComponent && <IconComponent className="text-primary\" size={20} />}
                          </div>
                          <div>
                            <CardTitle>{automation.title}</CardTitle>
                            <CardDescription>{automation.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                    {index < categoryAutomations.length - 1 && (
                      <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 z-10">
                        <ArrowDown className="text-primary/20" size={24} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};