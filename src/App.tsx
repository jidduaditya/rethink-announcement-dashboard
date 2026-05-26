import { Routes, Route } from 'react-router-dom'
import PublicBoard from './pages/PublicBoard'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AnnouncementEditor from './pages/AnnouncementEditor'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicBoard />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="new" element={<AnnouncementEditor />} />
        <Route path="edit/:id" element={<AnnouncementEditor />} />
      </Route>
    </Routes>
  )
}
