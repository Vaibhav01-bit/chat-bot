import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { UsernameSetup } from './pages/UsernameSetup'
import { Home } from './pages/Home'
import { Chat } from './pages/Chat'
import { RandomChat } from './pages/RandomChat'
import { SearchUsers } from './pages/SearchUsers'
import { Status } from './pages/Status'
import { StatusPost } from './pages/StatusPost'
import { StatusView } from './pages/StatusView'
import { Settings } from './pages/Settings'
import { ProfileEdit } from './pages/ProfileEdit'
import { ProfileView } from './pages/ProfileView'
import { FriendRequests } from './pages/FriendRequests'
import { ThemeSettings } from './pages/ThemeSettings'
import { PrivacySettings } from './pages/PrivacySettings'
import { AdminLayout } from './layouts/AdminLayout'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminUsers } from './pages/admin/AdminUsers'
import { AdminDebug } from './pages/admin/AdminDebug'
import { AdminStatuses } from './pages/admin/AdminStatuses'
import { AdminSettings } from './pages/admin/AdminSettings'
import { NotFound } from './pages/NotFound'
import { ProtectedRoute } from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route element={<ProtectedRoute requireUsername={false} />}>
                <Route path="/username-setup" element={<UsernameSetup />} />
              </Route>

              <Route element={<ProtectedRoute requireUsername={true} />}>
                <Route path="/" element={<MainLayout><Home /></MainLayout>} />
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
          </ErrorBoundary>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
