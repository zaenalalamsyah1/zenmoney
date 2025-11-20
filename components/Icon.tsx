import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    return <LucideIcons.HelpCircle size={size} className={className} />;
  }

  return <IconComponent size={size} className={className} />;
};
