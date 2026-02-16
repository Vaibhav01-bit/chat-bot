import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { PresenceManager } from './components/PresenceManager'

// Lazy load all route components for code splitting
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })))
const MainLayout = lazy(() => import('./layouts/MainLayout').then(m => ({ default: m.MainLayout })))
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })))
const UsernameSetup = lazy(() => import('./pages/UsernameSetup').then(m => ({ default: m.UsernameSetup })))
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })))
const Chat = lazy(() => import('./pages/Chat').then(m => ({ default: m.Chat })))
const RandomChat = lazy(() => import('./pages/RandomChat').then(m => ({ default: m.RandomChat })))
const SearchUsers = lazy(() => import('./pages/SearchUsers').then(m => ({ default: m.SearchUsers })))
const Status = lazy(() => import('./pages/Status').then(m => ({ default: m.Status })))
const StatusPost = lazy(() => import('./pages/StatusPost').then(m => ({ default: m.StatusPost })))
const StatusView = lazy(() => import('./pages/StatusView').then(m => ({ default: m.StatusView })))
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const ProfileEdit = lazy(() => import('./pages/ProfileEdit').then(m => ({ default: m.ProfileEdit })))
const ProfileView = lazy(() => import('./pages/ProfileView').then(m => ({ default: m.ProfileView })))
const FriendRequests = lazy(() => import('./pages/FriendRequests').then(m => ({ default: m.FriendRequests })))
const ThemeSettings = lazy(() => import('./pages/ThemeSettings').then(m => ({ default: m.ThemeSettings })))
const PrivacySettings = lazy(() => import('./pages/PrivacySettings').then(m => ({ default: m.PrivacySettings })))
const AdminLayout = lazy(() => import('./layouts/AdminLayout').then(m => ({ default: m.AdminLayout })))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then(m => ({ default: m.AdminLogin })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })))
const AdminDebug = lazy(() => import('./pages/admin/AdminDebug').then(m => ({ default: m.AdminDebug })))
const AdminStatuses = lazy(() => import('./pages/admin/AdminStatuses').then(m => ({ default: m.AdminStatuses })))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings').then(m => ({ default: m.AdminSettings })))
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })))

// Loading fallback component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'var(--bg-primary, #fff)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid rgba(0,0,0,0.1)',
      borderTopColor: '#3b82f6',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <PresenceManager />
      <ThemeProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route element={<ProtectedRoute requireUsername={false} />}>
                  <Route path="/username-setup" element={<UsernameSetup />} />
                </Route>

                <Route element={<ProtectedRoute requireUsername={true} />}>
                  <Route path="/chat" element={<MainLayout><Home /></MainLayout>} />
                  <Route path="/search" element={<SearchUsers />} />
                  <Route path="/random" element={<RandomChat />} />
                  <Route path="/status" element={<MainLayout><Status /></MainLayout>} />
                  <Route path="/status/post" element={<StatusPost />} />
                  <Route path="/status/:userId" element={<StatusView />} />

                  <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
                  <Route path="/settings/profile" element={<MainLayout><ProfileEdit /></MainLayout>} />
                  <Route path="/settings/theme" element={<MainLayout><ThemeSettings /></MainLayout>} />
                  <Route path="/settings/privacy" element={<MainLayout><PrivacySettings /></MainLayout>} />
                  <Route path="/profile/:userId" element={<MainLayout><ProfileView /></MainLayout>} />
                  <Route path="/requests" element={<MainLayout><FriendRequests /></MainLayout>} />

                  <Route path="/chat/:chatId" element={<Chat />} />
                </Route>

                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="login" element={<AdminLogin />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="statuses" element={<AdminStatuses />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="debug" element={<AdminDebug />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App

