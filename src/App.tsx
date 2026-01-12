import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import LibraryScreen from './pages/LibraryScreen'
import CreateSubjectScreen from './pages/CreateSubjectScreen'
import SubjectView from './pages/SubjectView'
import SettingsScreen from './pages/SettingsScreen'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { ProtectedRoute } from './components/ProtectedRoute'
import { GuestRoute } from './components/GuestRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <SignUpPage />
            </GuestRoute>
          }
        />
        {/* Legal pages - publicly accessible */}
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        {/* Redirect /app/login and /app/signup to their respective routes */}
        <Route path="/app/login" element={<Navigate to="/login" replace />} />
        <Route path="/app/signup" element={<Navigate to="/signup" replace />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="library" element={<LibraryScreen />} />
          <Route path="create" element={<CreateSubjectScreen />} />
          <Route path="subject/:id" element={<SubjectView />} />
          <Route path="settings" element={<SettingsScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
