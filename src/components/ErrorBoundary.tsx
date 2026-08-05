import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback. If omitted, the default styled fallback renders. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — top-level resilience layer.
 *
 * React unmounts the entire component tree when a render throws and nothing
 * catches it, which produces a blank white screen. This boundary catches any
 * render/lifecycle exception below it and shows a styled fallback with a
 * "Reload page" action instead. In dev/preview builds it also surfaces the
 * error message so the real cause is visible rather than hidden.
 *
 * Must be a class component: getDerivedStateFromError / componentDidCatch have
 * no hooks equivalent.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log for diagnosis. Replace with a real error reporter (Sentry, etc.) later.
    console.error('ErrorBoundary caught a render error:', error, errorInfo);
  }

  handleReload = (): void => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    const showDetails = Boolean(import.meta.env && import.meta.env.DEV);

    return (
      <div
        role="alert"
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
          backgroundColor: '#0e211d',
          color: '#f5f5f4',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, margin: 0 }}>Something went wrong</h1>
        <p style={{ maxWidth: '32rem', lineHeight: 1.6, color: '#a7f3d0', margin: 0 }}>
          The page hit an unexpected error and could not finish loading. Reloading usually fixes it.
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            border: 'none',
            backgroundColor: '#059669',
            color: '#ffffff',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reload page
        </button>
        {showDetails && this.state.error && (
          <pre
            style={{
              marginTop: '1.5rem',
              maxWidth: '48rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              textAlign: 'left',
              padding: '1rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(0,0,0,0.35)',
              color: '#fca5a5',
              fontSize: '0.8125rem',
            }}
          >
            {this.state.error.name}: {this.state.error.message}
            {this.state.error.stack ? '\n\n' + this.state.error.stack : ''}
          </pre>
        )}
      </div>
    );
  }
}
