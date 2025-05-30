import * as LucideIcons from 'lucide-react';

export type LucideIcon = React.FC<React.ComponentProps<typeof LucideIcons.AlertCircle>>;

// Export a record of all the icons from lucide-react
export const Icons = {
  ...LucideIcons
};