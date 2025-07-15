import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  AppLayout,
  AppHeader,
  AppMain,
  PageContainer,
  CenteredContainer,
} from './AppLayout';

describe('AppLayout', () => {
  it('should render children and apply base styles', () => {
    const { container } = render(<AppLayout>Test Content</AppLayout>);
    const div = container.firstChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('d-flex', 'flex-column');
    expect(div).toHaveStyle('height: 100vh');
  });

  it('should apply custom className and other props', () => {
    const { container } = render(
      <AppLayout className="custom-class" data-testid="layout">
        Custom
      </AppLayout>
    );
    const div = container.firstChild;
    expect(div).toHaveClass('custom-class');
    expect(div).toHaveAttribute('data-testid', 'layout');
  });
});

describe('AppHeader', () => {
  it('should render children and be a header element', () => {
    render(<AppHeader>Header Content</AppHeader>);
    const header = screen.getByText('Header Content');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');
  });

  it('should apply custom className and other props', () => {
    render(
      <AppHeader className="header-class" id="app-header">
        Header
      </AppHeader>
    );
    const header = screen.getByText('Header');
    expect(header).toHaveClass('header-class');
    expect(header).toHaveAttribute('id', 'app-header');
  });
});

describe('AppMain', () => {
  it('should render children and apply base styles', () => {
    const { container } = render(<AppMain>Main Content</AppMain>);
    const main = container.firstChild;
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-grow-1', 'd-flex');
  });

  it('should apply centered class when centered prop is true', () => {
    const { container } = render(<AppMain centered>Centered Content</AppMain>);
    const main = container.firstChild;
    expect(main).toHaveClass('align-items-center', 'justify-content-center');
  });

  it('should not apply centered class by default', () => {
    const { container } = render(<AppMain>Not Centered</AppMain>);
    const main = container.firstChild;
    expect(main).not.toHaveClass(
      'align-items-center',
      'justify-content-center'
    );
  });

  it('should apply custom className and other props', () => {
    const { container } = render(
      <AppMain className="main-class" role="main-area">
        Main
      </AppMain>
    );
    const main = container.firstChild;
    expect(main).toHaveClass('main-class');
    expect(main).toHaveAttribute('role', 'main-area');
  });
});

describe('PageContainer', () => {
  it('should render children and apply default container class', () => {
    const { container } = render(<PageContainer>Page Content</PageContainer>);
    const div = container.firstChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass('container', 'py-4');
  });

  it('should apply container-fluid class when fluid prop is true', () => {
    const { container } = render(
      <PageContainer fluid>Fluid Content</PageContainer>
    );
    const div = container.firstChild;
    expect(div).toHaveClass('container-fluid', 'py-4');
    expect(div).not.toHaveClass('container');
  });

  it('should apply custom className and other props', () => {
    const { container } = render(
      <PageContainer className="page-class" id="page-id">
        Page
      </PageContainer>
    );
    const div = container.firstChild;
    expect(div).toHaveClass('page-class');
    expect(div).toHaveAttribute('id', 'page-id');
  });
});

describe('CenteredContainer', () => {
  it('should render children and apply centering classes', () => {
    const { container } = render(
      <CenteredContainer>Centered Item</CenteredContainer>
    );
    const div = container.firstChild;
    expect(div).toBeInTheDocument();
    expect(div).toHaveClass(
      'w-100',
      'd-flex',
      'align-items-center',
      'justify-content-center'
    );
  });

  it('should apply custom className and other props', () => {
    const { container } = render(
      <CenteredContainer
        className="center-class"
        data-testid="center-container"
      >
        Center
      </CenteredContainer>
    );
    const div = container.firstChild;
    expect(div).toHaveClass('center-class');
    expect(div).toHaveAttribute('data-testid', 'center-container');
  });
});
