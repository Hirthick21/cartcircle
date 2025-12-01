
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  subtitle?: string;
}

export function SectionHeading({ 
  children, 
  size = 'medium', 
  className,
  subtitle 
}: SectionHeadingProps) {
  const sizeClasses = {
    small: 'section-heading-small',
    medium: 'section-heading',
    large: 'section-heading-large'
  };

  return (
    <div className={cn('mb-4', className)}>
      <h2 className={cn(sizeClasses[size], 'font-inter')}>
        {children}
      </h2>
      {subtitle && (
        <p className="section-subheading font-inter">
          {subtitle}
        </p>
      )}
    </div>
  );
}
