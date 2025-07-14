import React from 'react';

interface CenterLayoutProps {
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
}

export const CenterLayout: React.FC<CenterLayoutProps> = ({
  children,
  className = '',
  backgroundColor = 'bg-light',
}) => {
  return (
    <div className={`container-fluid vh-100 ${backgroundColor} ${className}`}>
      <div className="row h-100 align-items-center justify-content-center">
        {children}
      </div>
    </div>
  );
};

export default CenterLayout;
