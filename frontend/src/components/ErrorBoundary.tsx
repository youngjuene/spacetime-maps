import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-300 mb-6">
          The spacetime visualization encountered an error. Don't worry, this
          happens sometimes with complex 3D graphics.
        </p>

        {process.env.NODE_ENV === "development" && (
          <details className="text-left mb-6">
            <summary className="text-red-400 cursor-pointer mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs text-gray-400 bg-gray-900 p-3 rounded overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="space-y-3">
          <button
            onClick={resetErrorBoundary}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Reload Page
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          If this problem persists, try refreshing your browser or using a
          different device.
        </p>
      </div>
    </div>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

export function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        // Log error to console in development
        if (process.env.NODE_ENV === "development") {
          console.error("Error caught by boundary:", error, errorInfo);
        }

        // In production, you could send to error tracking service
        // Example: Sentry.captureException(error);
      }}
      onReset={() => {
        // Clear any error state, reload data, etc.
        window.location.hash = "";
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}

export default AppErrorBoundary;
