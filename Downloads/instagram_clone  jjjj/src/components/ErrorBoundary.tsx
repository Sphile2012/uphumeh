import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-24 text-center bg-background">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-8">
              We're sorry, but something unexpected happened. Please refresh the page to try again.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Refresh Page
              </button>
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Show error details
                </summary>
                <pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto">
                  {this.state.error?.stack || this.state.error?.message}
                </pre>
              </details>
            </div>
          </div>
          <footer className="mt-auto pt-12 text-xs text-muted-foreground uppercase tracking-widest">
            © 2026 Phume • Cloned by Phumeh
          </footer>
        </div>
      )
    }

    return this.props.children
  }
}