import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/auth-context'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ConfigCheck } from './components/ConfigCheck'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
        <ConfigCheck />
        <Toaster position="top-center" />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
