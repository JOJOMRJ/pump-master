import React from 'react';

interface AppLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// 主布局容器
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

// 头部区域（固定高度）
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

// 主内容区域（自适应高度）
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

// 页面容器（用于包装具体页面内容）
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

// 居中容器（用于登录页面等需要居中的内容）
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
