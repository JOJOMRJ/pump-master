import React from 'react';

interface AppLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Main layout container
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`d-flex flex-column ${className}`}
      style={{ height: '100vh' }}
      {...props}
    >
      {children}
    </div>
  );
};

interface AppHeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

// Header area (fixed height)
export const AppHeader: React.FC<AppHeaderProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <header className={className} {...props}>
      {children}
    </header>
  );
};

interface AppMainProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  centered?: boolean;
}

// Main content area (adaptive height)
export const AppMain: React.FC<AppMainProps> = ({
  children,
  className = '',
  centered = false,
  ...props
}) => {
  const centerClass = centered
    ? 'align-items-center justify-content-center'
    : '';

  return (
    <main
      className={`flex-grow-1 d-flex ${centerClass} ${className}`}
      {...props}
    >
      {children}
    </main>
  );
};

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fluid?: boolean;
}

// Page container (for wrapping specific page content)
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  fluid = false,
  className = '',
  ...props
}) => {
  const containerClass = fluid ? 'container-fluid' : 'container';

  return (
    <div className={`${containerClass} py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CenteredContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxWidth?: string;
}

// Center container (for login page and other content that needs centering)
export const CenteredContainer: React.FC<CenteredContainerProps> = ({
  children,
  className = '',

  ...props
}) => {
  return (
    <div
      className={`w-100 d-flex align-items-center justify-content-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
