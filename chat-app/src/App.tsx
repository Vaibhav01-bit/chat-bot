import { Routes, Route } from 'react-router-dom'
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
import { Admin } from './pages/Admin'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
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

          <Route path="/1234/admin" element={<Admin />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
